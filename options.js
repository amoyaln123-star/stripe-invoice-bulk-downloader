const DEFAULT_TEMPLATE = "{date}_{number}_{amount}.pdf";

document.addEventListener("DOMContentLoaded", async () => {
  const { filenameTemplate } = await chrome.storage.local.get("filenameTemplate");
  document.getElementById("template").value = filenameTemplate || DEFAULT_TEMPLATE;

  document.getElementById("save").addEventListener("click", async () => {
    const template = document.getElementById("template").value.trim() || DEFAULT_TEMPLATE;
    await chrome.storage.local.set({ filenameTemplate: template });
    const msg = document.getElementById("msg");
    msg.style.display = "block";
    setTimeout(() => msg.style.display = "none", 2000);
  });
});
