// background.js
importScripts("jszip.min.js");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "createZip") {
    createZip(msg.invoices).then(sendResponse).catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
  if (msg.action === "openUpgrade") {
    chrome.tabs.create({ url: "https://example.com/upgrade" });
  }
});

async function createZip(invoices) {
  if (!invoices?.length) return { success: false, error: "No invoices" };

  const zip = new JSZip();
  let added = 0;

  for (const inv of invoices) {
    try {
      const res = await fetch(inv.url, { credentials: "include" });
      if (!res.ok) continue;
      const blob = await res.blob();
      if (blob.size > 200) {
        zip.file(inv.filename, blob);
        added++;
      }
    } catch (e) {
      console.warn("Fetch failed", inv.url, e);
    }
  }

  if (added === 0) return { success: false, error: "No PDFs could be downloaded" };

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const url = URL.createObjectURL(blob);
  const name = `stripe-invoices-${new Date().toISOString().slice(0, 10)}.zip`;

  await chrome.downloads.download({ url, filename: name, saveAs: true });
  setTimeout(() => URL.revokeObjectURL(url), 120000);

  return { success: true, count: added };
}
