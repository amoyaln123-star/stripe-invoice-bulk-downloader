// content.js - Stripe Invoice Bulk Downloader
const FREE_LIMIT = 5;

let toolbar = null;
let statusEl = null;
let downloadBtn = null;

function init() {
  injectToolbar();
  observeAndEnhanceRows();
  updateUsageUI();
}

function injectToolbar() {
  if (document.getElementById("stripe-zip-toolbar")) return;

  toolbar = document.createElement("div");
  toolbar.id = "stripe-zip-toolbar";
  toolbar.className = "hidden";
  toolbar.innerHTML = `
    <span id="stripe-zip-status">Select invoices</span>
    <button id="stripe-zip-btn">Download ZIP</button>
  `;
  document.body.appendChild(toolbar);

  statusEl = toolbar.querySelector("#stripe-zip-status");
  downloadBtn = toolbar.querySelector("#stripe-zip-btn");
  downloadBtn.addEventListener("click", onDownload);
}

function observeAndEnhanceRows() {
  const enhance = () => {
    document.querySelectorAll('tr, [role="row"]').forEach(row => {
      if (row.dataset.zipEnhanced) return;
      if (!isLikelyInvoiceRow(row)) return;

      row.dataset.zipEnhanced = "1";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "stripe-zip-checkbox";
      checkbox.addEventListener("change", () => {
        row.classList.toggle("stripe-zip-row-selected", checkbox.checked);
        updateToolbar();
      });

      const firstCell = row.querySelector("td, th, [role='cell'], div") || row;
      firstCell.prepend(checkbox);
    });
  };

  enhance();
  new MutationObserver(enhance).observe(document.body, { childList: true, subtree: true });
}

function isLikelyInvoiceRow(row) {
  const text = (row.innerText || "").toLowerCase();
  return text.includes("invoice") || text.includes("inv-") || text.includes("paid") || text.includes("open") || text.includes("draft") || /\d{2,}/.test(text);
}

function updateToolbar() {
  const checked = document.querySelectorAll(".stripe-zip-checkbox:checked");
  if (checked.length === 0) {
    toolbar.classList.add("hidden");
    return;
  }
  toolbar.classList.remove("hidden");
  statusEl.textContent = `${checked.length} selected`;
  updateUsageUI();
}

async function updateUsageUI() {
  const { usageCount = 0, isPro = false } = await chrome.storage.local.get(["usageCount", "isPro"]);
  if (!statusEl) return;
  const left = Math.max(0, FREE_LIMIT - usageCount);
  if (isPro) {
    statusEl.textContent += " · Pro";
  } else if (left <= 2) {
    statusEl.textContent += ` · ${left} free left`;
  }
}

async function onDownload() {
  const checked = [...document.querySelectorAll(".stripe-zip-checkbox:checked")];
  if (checked.length === 0) return;

  const { usageCount = 0, isPro = false } = await chrome.storage.local.get(["usageCount", "isPro"]);
  if (!isPro && usageCount >= FREE_LIMIT) {
    alert("Free limit reached. Upgrade to Pro for unlimited downloads.");
    chrome.runtime.sendMessage({ action: "openUpgrade" });
    return;
  }

  downloadBtn.disabled = true;
  statusEl.textContent = "Collecting...";

  const invoices = checked.map(cb => extractInvoiceFromRow(cb.closest("tr, [role='row']"))).filter(Boolean);

  if (invoices.length === 0) {
    statusEl.textContent = "No valid PDFs found";
    downloadBtn.disabled = false;
    return;
  }

  statusEl.textContent = `Downloading ${invoices.length}...`;

  chrome.runtime.sendMessage({ action: "createZip", invoices }, async (res) => {
    downloadBtn.disabled = false;
    if (res?.success) {
      if (!isPro) await chrome.storage.local.set({ usageCount: usageCount + 1 });
      statusEl.textContent = `✓ Downloaded ${res.count}`;
      setTimeout(updateToolbar, 2000);
    } else {
      statusEl.textContent = "Failed: " + (res?.error || "unknown");
    }
  });
}

function extractInvoiceFromRow(row) {
  if (!row) return null;
  const link = row.querySelector('a[href*="pdf"], a[href*="invoice"], a[href*="files.stripe.com"], a[download]');
  if (!link) return null;

  const text = row.innerText || "";
  const number = (text.match(/(INV|in_)[A-Za-z0-9_-]+/i) || [`inv_${Date.now()}`])[0];
  const amount = (text.match(/\$[\d,]+\.?\d*/) || [""])[0].replace(/[^0-9.]/g, "");
  const date = (text.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/) || [""])[0].replace(/\//g, "-");

  let filename = `${date || "undated"}_${number}_${amount || "0"}.pdf`;
  filename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

  return { url: link.href, filename };
}

init();
