document.addEventListener("DOMContentLoaded", async () => {
  const status = document.getElementById("status");
  const upgrade = document.getElementById("upgrade");
  const reset = document.getElementById("reset");

  async function refresh() {
    const { usageCount = 0, isPro = false } = await chrome.storage.local.get(["usageCount", "isPro"]);
    if (isPro) {
      status.innerHTML = "<strong style='color:#16a34a'>Pro</strong> — unlimited downloads";
      upgrade.style.display = "none";
    } else {
      const left = Math.max(0, 5 - usageCount);
      status.textContent = `Free downloads left: ${left} / 5`;
    }
  }

  await refresh();

  upgrade.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://example.com/upgrade" });
  });

  reset.addEventListener("click", async () => {
    await chrome.storage.local.set({ usageCount: 0, isPro: false });
    await refresh();
  });
});
