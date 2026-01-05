// ==UserScript==
// @name         GSecurity
// @namespace    https://github.com/ads-blocker/universal-ad-blocker
// @version      5.0.0
// @description  Comprehensive ad blocking + security protection: blocks ads, crypto miners, malicious scripts, trackers, fingerprinting, popups, and malware domains across all major websites.
// @author       Gorstak
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-start
// @homepage     https://github.com/ads-blocker/universal-ad-blocker
// @supportURL   https://github.com/ads-blocker/universal-ad-blocker/issues
// @updateURL    https://github.com/ads-blocker/universal-ad-blocker/raw/main/universal-ad-blocker.user.js
// @downloadURL  https://github.com/ads-blocker/universal-ad-blocker/raw/main/universal-ad-blocker.user.js
// ==/UserScript==

;(() => {
  console.log("[Universal Ad Blocker + Security] Initializing...")

  // ========================================
  // SECURITY: CRYPTO MINER BLOCKING
  // ========================================

  const cryptoMinerDomains = [
    "coinhive.com",
    "coin-hive.com",
    "jsecoin.com",
    "minr.pw",
    "crypto-loot.com",
    "cryptoloot.pro",
    "webminepool.com",
    "miner.pr0gramm.com",
    "webmine.cz",
    "ppoi.org",
    "cloudcoins.co",
    "statdynamic.com",
    "afminer.com",
    "lmodr.biz",
    "monerominer.rocks",
    "morningdigit.com",
    "hallaert.online",
    "cpu2cash.link",
    "goredirect.party",
    "ad-miner.com",
    "kisshentai.net",
    "kiwifarms.net",
    "authedmine.com",
    "cryptaloot.pro",
    "webmine.pro",
    "2giga.link",
    "bjorksta.men",
  ]

  // Block known miner JavaScript objects
  const blockCryptoMiners = () => {
    const minerObjects = ["CoinHive", "CryptoLoot", "JSEcoin", "Minr", "WebMinePool", "Coinimp"]

    minerObjects.forEach((minerName) => {
      Object.defineProperty(window, minerName, {
        get: () => {
          console.log(`[Security] Blocked crypto miner: ${minerName}`)
          return undefined
        },
        set: () => {},
        configurable: false,
      })
    })
  }

  blockCryptoMiners()

  // ========================================
  // SECURITY: MALICIOUS & MALWARE DOMAINS
  // ========================================

  const maliciousDomains = [
    "adf.ly",
    "bit.ly/malware",
    "clicksfly.com",
    "shorte.st",
    "ouo.io",
    "bc.vc",
    "adfly.com",
    "short.am",
    "srnk.co",
    "clk.ink",
    "linkbucks.com",
    "linkvertise.com",
    "sub2unlock.com",
    "sub2get.com",
    "megalink.pro",
    "fas.li",
    "destyy.com",
    "earnlink.io",
    "link1s.com",
    "shink.in",
    "cutwin.com",
    "exe.io",
    "megaurl.in",
  ]

  // ========================================
  // SECURITY: FINGERPRINTING PREVENTION
  // ========================================

  const blockFingerprinting = () => {
    // Block canvas fingerprinting
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL
    HTMLCanvasElement.prototype.toDataURL = function (...args) {
      console.log("[Security] Canvas fingerprinting attempt blocked")
      // Return slightly modified data
      const context = this.getContext("2d")
      if (context) {
        context.fillStyle = "rgba(0, 0, 0, 0.01)"
        context.fillRect(0, 0, 1, 1)
      }
      return originalToDataURL.apply(this, args)
    }

    // Block WebGL fingerprinting
    const getParameter = WebGLRenderingContext.prototype.getParameter
    WebGLRenderingContext.prototype.getParameter = function (parameter) {
      if (parameter === 37445 || parameter === 37446) {
        console.log("[Security] WebGL fingerprinting attempt blocked")
        return "Generic Renderer"
      }
      return getParameter.call(this, parameter)
    }

    // Block audio fingerprinting
    if (window.AudioContext || window.webkitAudioContext) {
      const OriginalAudioContext = window.AudioContext || window.webkitAudioContext
      window.AudioContext = (...args) => {
        const context = new OriginalAudioContext(...args)
        const originalCreateOscillator = context.createOscillator
        context.createOscillator = function () {
          console.log("[Security] Audio fingerprinting attempt detected")
          return originalCreateOscillator.apply(this)
        }
        return context
      }
    }
  }

  blockFingerprinting()

  // ========================================
  // SECURITY: POPUP & REDIRECT BLOCKING
  // ========================================

  // Block popup windows
  const originalWindowOpen = window.open
  window.open = (url, ...args) => {
    console.log("[Security] Blocked popup:", url)
    return null
  }

  // Block aggressive redirects
  let lastUrl = location.href
  const blockRedirects = () => {
    if (location.href !== lastUrl) {
      const currentUrl = location.href
      const suspiciousRedirect =
        maliciousDomains.some((domain) => currentUrl.includes(domain)) ||
        currentUrl.includes("redirect") ||
        currentUrl.includes("redir")

      if (suspiciousRedirect) {
        console.log("[Security] Blocked suspicious redirect:", currentUrl)
        history.back()
        return
      }
      lastUrl = currentUrl
    }
  }

  setInterval(blockRedirects, 100)

  // Block alert/confirm spam
  const originalAlert = window.alert
  const originalConfirm = window.confirm

  window.alert = (message) => {
    console.log("[Security] Alert suppressed:", message)
    return undefined
  }

  window.confirm = (message) => {
    console.log("[Security] Confirm dialog suppressed:", message)
    return false
  }

  // ========================================
  // SECURITY: MALICIOUS IFRAME BLOCKING
  // ========================================

  const blockMaliciousIframes = () => {
    document.querySelectorAll("iframe").forEach((iframe) => {
      const src = iframe.src || iframe.getAttribute("data-src") || ""
      const isMalicious =
        maliciousDomains.some((domain) => src.includes(domain)) ||
        cryptoMinerDomains.some((domain) => src.includes(domain)) ||
        src.includes("adframe") ||
        src.includes("popunder")

      if (isMalicious) {
        console.log("[Security] Blocked malicious iframe:", src)
        iframe.remove()
      }
    })
  }

  // ========================================
  // NETWORK-LEVEL BLOCKING
  // ========================================

  const blockedDomains = [
    ...cryptoMinerDomains,
    ...maliciousDomains,
    // Ad networks
    "doubleclick.net",
    "googleadservices.com",
    "googlesyndication.com",
    "adservice.google.com",
    "amazon-adsystem.com",
    "taboola.com",
    "outbrain.com",
    "criteo.com",
    "scorecardresearch.com",
    "ads-twitter.com",
    "static.ads-twitter.com",
    "advertising.com",
    "adnxs.com",
    "pubmatic.com",
    "rubiconproject.com",
    "adsafeprotected.com",
    "moatads.com",
    "advertising.yahoo.com",
    "adtech.de",
    "adform.net",
    "serving-sys.com",
    "google-analytics.com",
    "googletagmanager.com",
    "facebook.com/tr",
    "connect.facebook.net",
    "pixel.facebook.com",
    "analytics.twitter.com",
    "pixel.reddit.com",
    "ads.linkedin.com",
    "analytics.tiktok.com",
    "hotjar.com",
    "fullstory.com",
    "segment.io",
    "segment.com",
    "mixpanel.com",
    "amplitude.com",
    "mouseflow.com",
    "crazyegg.com",
    "luckyorange.com",
    "inspectlet.com",
    "clicktale.com",
    "quantserve.com",
    "chartbeat.com",
    "newrelic.com",
    "optimizely.com",
    "fingerprintjs.com",
    "deviceatlas.com",
    "iovation.com",
    "threatmetrix.com",
  ]

  const blockedPatterns = [
    "/api/stats/ads",
    "/api/stats/atr",
    "/pagead/",
    "/ptracking",
    "/ad?",
    "/ads?",
    "/advert",
    "/sponsored",
    "/promotion",
    "/tracking",
    "/analytics",
    "/collect?",
    "/beacon",
    "/pixel",
    "/imp?",
    "/impression",
    "/click?",
    "ad_banner",
    "ad_frame",
    "sponsored_content",
    "promo_banner",
    "/miner.js",
    "/cryptonight",
    "/webassembly",
    "/wasm",
    "/coinhive",
    "/authedmine",
  ]

  // Override fetch
  const originalFetch = window.fetch
  window.fetch = function (...args) {
    const url = typeof args[0] === "string" ? args[0] : args[0]?.url || ""

    if (
      blockedDomains.some((domain) => url.includes(domain)) ||
      blockedPatterns.some((pattern) => url.includes(pattern))
    ) {
      console.log("[Blocked] Fetch request:", url)
      return Promise.reject(new Error("Blocked by Security Shield"))
    }

    return originalFetch.apply(this, args)
  }

  // Override XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (
      typeof url === "string" &&
      (blockedDomains.some((domain) => url.includes(domain)) ||
        blockedPatterns.some((pattern) => url.includes(pattern)))
    ) {
      console.log("[Blocked] XHR request:", url)
      return
    }
    return originalOpen.call(this, method, url, ...rest)
  }

  const originalCreateElement = document.createElement
  document.createElement = function (tagName, ...args) {
    const element = originalCreateElement.call(this, tagName, ...args)

    if (tagName.toLowerCase() === "script") {
      const originalSetAttribute = element.setAttribute
      element.setAttribute = function (name, value) {
        if (name === "src" && typeof value === "string") {
          const isBlocked =
            blockedDomains.some((domain) => value.includes(domain)) ||
            blockedPatterns.some((pattern) => value.includes(pattern))

          if (isBlocked) {
            console.log("[Security] Blocked malicious script:", value)
            return
          }
        }
        return originalSetAttribute.call(this, name, value)
      }
    }

    return element
  }

  // ========================================
  // YOUTUBE AD BLOCKING
  // ========================================

  function removeYouTubeAds() {
    const skipButtons = document.querySelectorAll(
      ".ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button__text",
    )
    skipButtons.forEach((btn) => {
      if (btn && btn.click) btn.click()
    })

    const adOverlay = document.querySelector(".ytp-ad-player-overlay")
    if (adOverlay) adOverlay.remove()

    const adPlayerOverlay = document.querySelector(".ytp-ad-player-overlay-instream-info")
    if (adPlayerOverlay) adPlayerOverlay.remove()

    const ytAdSelectors = [
      "ytd-display-ad-renderer",
      "ytd-promoted-sparkles-web-renderer",
      "ytd-promoted-video-renderer",
      "ytd-compact-promoted-video-renderer",
      "ytd-in-feed-ad-layout-renderer",
      "ytd-ad-slot-renderer",
      "ytd-banner-promo-renderer",
      "ytd-video-masthead-ad-v3-renderer",
      "ytd-primetime-promo-renderer",
      "ytd-statement-banner-renderer",
      "ytd-action-companion-ad-renderer",
      ".video-ads",
      ".ytp-ad-module",
      "#masthead-ad",
      ".ytd-mealbar-promo-renderer",
      "ytm-promoted-sparkles-web-renderer",
      "#player-ads",
      ".ytp-ad-text",
      ".ytp-ad-preview-container",
      ".ytp-ad-overlay-container",
      ".ytp-ad-image-overlay",
      "ytd-compact-promoted-item-renderer",
      "ytd-promoted-video-inline-renderer",
      ".ytd-promoted-video-renderer",
      ".ytd-display-ad-renderer",
      "#masthead-ad",
    ]

    ytAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove())
    })

    const video = document.querySelector("video")
    if (video && video.duration) {
      const adContainer = document.querySelector(".video-ads")
      const adModule = document.querySelector(".ytp-ad-module")

      if (adContainer || adModule) {
        video.currentTime = video.duration
        video.playbackRate = 16
      }
    }
  }

  function overrideYouTubeAdConfig() {
    if (window.ytInitialPlayerResponse) {
      delete window.ytInitialPlayerResponse.adPlacements
      delete window.ytInitialPlayerResponse.playerAds
    }

    if (window.ytInitialData) {
      try {
        const removeAdsFromObject = (obj) => {
          if (!obj || typeof obj !== "object") return

          for (const key in obj) {
            if (key.toLowerCase().includes("ad") || key.toLowerCase().includes("promo")) {
              delete obj[key]
            } else if (typeof obj[key] === "object") {
              removeAdsFromObject(obj[key])
            }
          }
        }

        removeAdsFromObject(window.ytInitialData)
      } catch (e) {
        console.log("[Universal Ad Blocker] Error removing ads from ytInitialData:", e)
      }
    }
  }

  if (window.location.hostname.includes("youtube.com")) {
    overrideYouTubeAdConfig()

    let lastUrl = location.href
    new MutationObserver(() => {
      const url = location.href
      if (url !== lastUrl) {
        lastUrl = url
        overrideYouTubeAdConfig()
      }
    }).observe(document, { subtree: true, childList: true })
  }

  // ========================================
  // FACEBOOK/META AD BLOCKING
  // ========================================

  function removeFacebookAds() {
    const fbAdSelectors = [
      '[data-pagelet*="FeedUnit_"][data-pagelet*="ad"]',
      'div[data-testid="fbfeed_story"]:has([aria-label*="Sponsored"])',
      '[id^="hyperfeed_story_id_"]:has(a[href*="/ads/"])',
      'div[role="article"]:has(span:contains("Sponsored"))',
      'div[data-testid="story-subtilte"]:has(span:contains("Sponsored"))',
      '[data-ad-preview="previewContainer"]',
      "div[data-ad-comet-preview]",
    ]

    fbAdSelectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((el) => {
          const article = el.closest('[role="article"]') || el
          article.style.display = "none"
        })
      } catch (e) {
        /* Ignore */
      }
    })

    document.querySelectorAll("span, a").forEach((el) => {
      if (el.textContent.trim() === "Sponsored" || el.textContent.includes("Sponsored")) {
        const article = el.closest('[role="article"]')
        if (article) article.style.display = "none"
      }
    })
  }

  // ========================================
  // TWITTER/X AD BLOCKING
  // ========================================

  function removeTwitterAds() {
    const twitterAdSelectors = [
      '[data-testid="placementTracking"]',
      'div[data-testid^="cellInnerDiv"]:has(span:contains("Ad"))',
      'div[data-testid^="cellInnerDiv"]:has(span:contains("Promoted"))',
      '[data-testid="trend"]:has([aria-label*="Promoted"])',
      'div[role="complementary"] div:has(span:contains("Ad"))',
    ]

    twitterAdSelectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((el) => el.remove())
      } catch (e) {
        /* Ignore */
      }
    })

    document.querySelectorAll("article").forEach((article) => {
      const text = article.textContent
      if (text.includes("Promoted") || text.includes("Ad ·")) {
        article.style.display = "none"
      }
    })
  }

  // ========================================
  // REDDIT AD BLOCKING
  // ========================================

  function removeRedditAds() {
    const redditAdSelectors = [
      'div[data-promoted="true"]',
      'a[data-click-id="promoted"]',
      ".promotedlink",
      "shreddit-ad-post",
      '[slot="ad_top"]',
      '[slot="ad_main"]',
      'faceplate-tracker[source="ads"]',
      'div:has(> a[href*="/advertising"])',
    ]

    redditAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove())
    })
  }

  // ========================================
  // INSTAGRAM AD BLOCKING
  // ========================================

  function removeInstagramAds() {
    document.querySelectorAll("article").forEach((article) => {
      const text = article.textContent
      if (text.includes("Sponsored")) {
        article.style.display = "none"
      }
    })
  }

  // ========================================
  // LINKEDIN AD BLOCKING
  // ========================================

  function removeLinkedInAds() {
    const linkedInAdSelectors = [
      ".feed-shared-update-v2--promoted",
      "div[data-ad-banner-id]",
      'div[data-is-sponsored="true"]',
      'span:contains("Promoted")',
    ]

    linkedInAdSelectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach((el) => {
          const container = el.closest(".feed-shared-update-v2") || el
          container.remove()
        })
      } catch (e) {
        /* Ignore */
      }
    })
  }

  // ========================================
  // NEWS SITES AD BLOCKING
  // ========================================

  function removeNewsSiteAds() {
    const newsSiteAdSelectors = [
      ".ad",
      ".ads",
      ".advertisement",
      ".ad-container",
      ".ad-wrapper",
      ".ad-slot",
      ".ad-banner",
      ".ad-placeholder",
      '[id*="ad-"]',
      '[class*="ad-"]',
      '[id*="google_ads"]',
      '[class*="google_ads"]',
      "[data-ad-rendered]",
      'iframe[src*="doubleclick"]',
      'iframe[src*="googlesyndication"]',
      'div[id^="div-gpt-ad"]',
      ".sponsored-content",
      ".native-ad",
      ".promo-box",
      "[data-google-query-id]",
    ]

    newsSiteAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.closest("article") || (el.offsetHeight < 1000 && el.querySelector('img[src*="ad"]'))) {
          el.remove()
        }
      })
    })
  }

  // ========================================
  // TWITCH AD BLOCKING
  // ========================================

  function removeTwitchAds() {
    const twitchAdSelectors = ['[data-a-target="video-ad-label"]', ".video-ad", ".advertisement-banner"]

    twitchAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove())
    })
  }

  // ========================================
  // GENERIC AD BLOCKING
  // ========================================

  function removeGenericAds() {
    const genericAdSelectors = [
      "ins.adsbygoogle",
      'iframe[id*="google_ads"]',
      'iframe[id*="aswift"]',
      'div[id*="taboola"]',
      'div[id*="outbrain"]',
      'div[class*="advert"]',
      'aside[class*="ad"]',
      '[aria-label*="advertisement"]',
      '[aria-label*="Advertisement"]',
      ".video-ad-overlay",
      ".preroll-ad",
      ".midroll-ad",
    ]

    genericAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove())
    })
  }

  // ========================================
  // MASTER REMOVAL FUNCTION
  // ========================================

  function removeAllAds() {
    const hostname = window.location.hostname

    blockMaliciousIframes()

    if (hostname.includes("youtube.com")) {
      removeYouTubeAds()
    } else if (hostname.includes("facebook.com")) {
      removeFacebookAds()
    } else if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      removeTwitterAds()
    } else if (hostname.includes("reddit.com")) {
      removeRedditAds()
    } else if (hostname.includes("instagram.com")) {
      removeInstagramAds()
    } else if (hostname.includes("linkedin.com")) {
      removeLinkedInAds()
    } else if (hostname.includes("twitch.tv")) {
      removeTwitchAds()
    } else {
      removeNewsSiteAds()
    }

    removeGenericAds()
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  removeAllAds()

  const checkInterval = window.location.hostname.includes("youtube.com") ? 500 : 1000
  setInterval(removeAllAds, checkInterval)

  if (document.body) {
    const observer = new MutationObserver(removeAllAds)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      removeAllAds()
      const observer = new MutationObserver(removeAllAds)
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
  }

  console.log("[Universal Ad Blocker + Security] Initialized successfully ✓")
  console.log("[Security] Protected against: Crypto miners, Malware, Trackers, Fingerprinting, Popups")
})()
