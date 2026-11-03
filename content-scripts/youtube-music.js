// YouTube Music Ad Blocker
console.log("🎵 YouTube Music Ad Blocker Active");

let adsBlocked = 0;
let observer = null;
let videoAdObserver = null;

// Configuration
const config = {
    checkInterval: 500,
    maxAttempts: 10,
};

// Selectors for YouTube Music ads
const adSelectors = [
    // Video ads
    ".video-ads",
    ".ytp-ad-module",
    ".ytp-ad-overlay-container",
    ".ytp-ad-text",
    ".ytp-ad-preview-container",

    // Display ads
    "ytmusic-popup-container",
    ".ytmusic-ad-slot",
    '[class*="ad-showing"]',

    // Premium prompts
    "ytmusic-premium-upsell",
    "ytmusic-trial-container",

    // Banner ads
    "#masthead-ad",
    "ytd-display-ad-renderer",
    "ytd-banner-promo-renderer",

    // Sponsored content
    '[id*="advertisement"]',
    '[class*="advertisement"]',
    '[id*="sponsor"]',
    '[class*="sponsor"]',
];

// Skip button selectors
const skipButtonSelectors = [
    ".ytp-ad-skip-button",
    ".ytp-ad-skip-button-modern",
    ".ytp-skip-ad-button",
    'button[class*="skip"]',
    ".videoAdUiSkipButton",
];

// Initialize ad blocker
function init() {
    console.log("Initializing YouTube Music Ad Blocker...");

    // Remove existing ads
    removeAds();

    // Start mutation observer
    startObserver();

    // Monitor video player
    monitorVideoPlayer();

    // Skip video ads automatically
    autoSkipAds();

    // Block ad requests
    blockAdRequests();

    // Hide premium prompts
    hidePremiumPrompts();
}

// Remove all ads from page
function removeAds() {
    let removed = 0;

    adSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
                removed++;
            }
        });
    });

    if (removed > 0) {
        adsBlocked += removed;
        console.log(`🚫 Removed ${removed} ad elements`);
        notifyAdBlocked(removed);
    }

    return removed;
}

// Start mutation observer to detect new ads
function startObserver() {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
        let shouldCheck = false;

        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        // Element node
                        const el = node;

                        // Check if it's an ad
                        const isAd = adSelectors.some((selector) => {
                            try {
                                return el.matches && el.matches(selector);
                            } catch (e) {
                                return false;
                            }
                        });

                        if (isAd) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });

        if (shouldCheck) {
            removeAds();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    console.log("👁️ Mutation observer started");
}

// Monitor video player for ads
function monitorVideoPlayer() {
    const checkVideoAds = () => {
        const video = document.querySelector("video");

        if (video) {
            // Check for ad playing
            const adContainer = document.querySelector(".ad-showing");
            const adText = document.querySelector(".ytp-ad-text");

            if (adContainer || adText) {
                console.log("🚫 Video ad detected, attempting to skip...");

                // Try to skip
                skipAd();

                // Or mute and speed up
                video.muted = true;
                video.playbackRate = 16;
                video.currentTime = video.duration - 0.1;
            } else {
                // Restore normal playback
                if (video.playbackRate !== 1) {
                    video.playbackRate = 1;
                }
                if (video.muted && !isUserMuted()) {
                    video.muted = false;
                }
            }
        }
    };

    setInterval(checkVideoAds, config.checkInterval);
}

// Auto skip ads
function autoSkipAds() {
    setInterval(() => {
        skipAd();
    }, 1000);
}

// Skip ad if skip button is available
function skipAd() {
    skipButtonSelectors.forEach((selector) => {
        const skipButton = document.querySelector(selector);
        if (skipButton && skipButton.offsetParent !== null) {
            console.log("⏭️ Clicking skip button");
            skipButton.click();
            adsBlocked++;
            notifyAdBlocked(1);
        }
    });
}

// Check if user intentionally muted
function isUserMuted() {
    // Check if mute button shows unmute icon
    const muteButton = document.querySelector(".ytp-mute-button");
    return muteButton?.getAttribute("aria-label")?.includes("Unmute");
}

// Block ad-related network requests
function blockAdRequests() {
    // Override fetch to block ad requests
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
        const url = args[0];

        if (typeof url === "string") {
            const adPatterns = [
                "/pagead/",
                "/api/stats/ads",
                "/ptracking",
                "/get_video_info",
                "doubleclick.net",
                "googleadservices.com",
            ];

            const isAdRequest = adPatterns.some((pattern) =>
                url.includes(pattern),
            );

            if (isAdRequest) {
                console.log("🚫 Blocked ad request:", url);
                return Promise.reject(new Error("Ad blocked"));
            }
        }

        return originalFetch.apply(this, args);
    };

    // Override XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        const adPatterns = [
            "/pagead/",
            "/api/stats/ads",
            "/ptracking",
            "doubleclick.net",
        ];

        const isAdRequest = adPatterns.some((pattern) => url.includes(pattern));

        if (isAdRequest) {
            console.log("🚫 Blocked XHR ad request:", url);
            return;
        }

        return originalOpen.call(this, method, url, ...rest);
    };
}

// Hide premium prompts
function hidePremiumPrompts() {
    const style = document.createElement("style");
    style.textContent = `
    ytmusic-popup-container,
    ytmusic-premium-upsell,
    ytmusic-trial-container,
    tp-yt-paper-dialog:has([aria-label*="Premium"]),
    [aria-label*="Premium"],
    [class*="premium-upsell"] {
      display: none !important;
    }

    /* Hide video ads */
    .video-ads,
    .ytp-ad-module,
    .ytp-ad-overlay-container,
    .ad-showing {
      display: none !important;
    }

    /* Hide banner ads */
    #masthead-ad,
    ytd-display-ad-renderer,
    ytd-banner-promo-renderer {
      display: none !important;
    }
  `;

    document.head.appendChild(style);
    console.log("💅 CSS ad blocking applied");
}

// Notify background script about blocked ad
function notifyAdBlocked(count = 1) {
    chrome.runtime
        .sendMessage({
            type: "AD_BLOCKED",
            count: count,
            url: window.location.href,
        })
        .catch(() => {
            console.log("Could not notify background script");
        });
}

// Inject script to block ads at page level
function injectPageScript() {
    const script = document.createElement("script");
    script.textContent = `
    (function() {
      // Block ad config
      if (window.ytcfg) {
        const originalSet = window.ytcfg.set;
        window.ytcfg.set = function(config) {
          if (config && typeof config === 'object') {
            // Disable ads
            config.PLAYER_VARS = config.PLAYER_VARS || {};
            config.PLAYER_VARS.ad_tag = '';
            config.PLAYER_VARS.afv_ad_tag = '';
          }
          return originalSet.apply(this, arguments);
        };
      }

      // Block ad events
      if (window.ytplayer && window.ytplayer.config) {
        window.ytplayer.config.args.ad3_module = '';
        window.ytplayer.config.args.ad_device = '';
        window.ytplayer.config.args.ad_flags = '';
      }

      console.log('🛡️ Page-level ad blocking active');
    })();
  `;

    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

// Clean up on page unload
window.addEventListener("beforeunload", () => {
    if (observer) {
        observer.disconnect();
    }
});

// Start the ad blocker
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

// Inject page-level blocking
injectPageScript();

// Report status
console.log(
    `✅ YouTube Music Ad Blocker initialized. Ads blocked: ${adsBlocked}`,
);
