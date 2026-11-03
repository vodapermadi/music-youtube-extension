// Ad Blocker Background Script for YouTube Music Only
let stats = { total: 0 };

chrome.storage.local.get(["blockedStats"], (result) => {
    if (result.blockedStats) {
        stats = result.blockedStats;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "AD_BLOCKED") {
        stats.total += request.count || 1;
        chrome.storage.local.set({ blockedStats: stats });
        updateBadge(sender.tab?.id);
        sendResponse({ success: true });
    } else if (request.type === "GET_STATS") {
        sendResponse({ stats: stats });
    } else if (request.type === "RESET_STATS") {
        stats = { total: 0 };
        chrome.storage.local.set({ blockedStats: stats });
        sendResponse({ success: true });
    }
    return true;
});

function updateBadge(tabId) {
    if (tabId) {
        chrome.action.setBadgeText({
            text: stats.total > 0 ? stats.total.toString() : "",
            tabId: tabId,
        });
        chrome.action.setBadgeBackgroundColor({
            color: "#FF0000",
            tabId: tabId,
        });
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        const url = details.url.toLowerCase();
        const adDomains = [
            "doubleclick.net",
            "googleadservices.com",
            "/pagead/",
            "/ptracking",
            "music.youtube.com/api/stats/ads",
            "music.youtube.com/pagead/"
        ];

        if (adDomains.some((domain) => url.includes(domain))) {
            return { cancel: true };
        }
        return { cancel: false };
    },
    {
        urls: [
            "*://*.doubleclick.net/*",
            "*://*.googleadservices.com/*",
            "*://music.youtube.com/api/stats/*",
            "*://music.youtube.com/pagead/*"
        ],
    },
    ["blocking"]
);

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        enabled: true,
        blockYouTubeMusicAds: true
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        updateBadge(tabId);
    }
});
