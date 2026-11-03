const totalBlocked = document.getElementById("totalBlocked");
const ytMusicToggle = document.getElementById("ytMusicToggle");
const resetStats = document.getElementById("resetStats");
const refreshPage = document.getElementById("refreshPage");

function loadStats() {
    chrome.runtime.sendMessage({ type: "GET_STATS" }, (response) => {
        if (response && response.stats) {
            animateValue(totalBlocked, 0, response.stats.total, 1000);
        }
    });
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    if (range === 0) {
        element.textContent = end.toLocaleString();
        return;
    }
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

function loadSettings() {
    chrome.storage.local.get(["blockYouTubeMusicAds"], (result) => {
        ytMusicToggle.checked = result.blockYouTubeMusicAds !== false;
    });
}

ytMusicToggle.addEventListener("change", () => {
    chrome.storage.local.set({ blockYouTubeMusicAds: ytMusicToggle.checked });
});

resetStats.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "RESET_STATS" }, () => {
        totalBlocked.textContent = "0";
        showNotification("Statistik direset!");
    });
});

refreshPage.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id);
            showNotification("Halaman di-refresh!");
        }
    });
});

function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

loadStats();
loadSettings();
setInterval(loadStats, 2000);
