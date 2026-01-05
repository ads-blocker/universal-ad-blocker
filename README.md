# Universal Ad Blocker Pro + Security Shield - Tampermonkey Script

## Overview
A comprehensive userscript that blocks ads AND protects your security across all websites. Blocks ads, crypto miners, malicious scripts, trackers, fingerprinting attempts, popups, and malware domains.

## Features
- **Network-level blocking**: Intercepts ad requests before they're made
- **Site-specific blocking**: Custom logic for major platforms
- **Generic ad removal**: Works on most websites with standard ad containers
- **Tracking prevention**: Blocks analytics and tracking scripts
- **Lightweight**: No external dependencies
- **Privacy-focused**: All blocking happens locally in your browser

### Security Protection
- **Crypto miner blocking**: Stops CoinHive, CryptoLoot, JSEcoin, and other mining scripts
- **Malicious domain blocking**: Prevents connections to known malware and phishing sites
- **Fingerprinting prevention**: Blocks canvas, WebGL, and audio fingerprinting
- **Popup blocking**: Stops aggressive popup windows and redirects
- **Malicious iframe blocking**: Removes dangerous embedded content
- **Script injection prevention**: Blocks malicious JavaScript from loading
- **Alert/Confirm spam suppression**: Prevents annoying dialog spam

## Supported Sites
- **Universal protection**: Works on ALL websites with `@match *://*/*`
- YouTube (video ads, display ads, sponsored content)
- Facebook/Meta (sponsored posts, ad banners)
- Twitter/X (promoted tweets, ads)
- Instagram (sponsored posts)
- Reddit (promoted posts)
- LinkedIn (promoted content)
- Twitch (video ads)
- Major news sites (CNN, Forbes, NYT, Washington Post, Guardian, BBC, Medium)
- Generic support for most other websites

## Installation

### Method 1: Greasy Fork (Recommended)
1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Visit the script page on [Greasy Fork](https://greasyfork.org/)
3. Click "Install this script"

### Method 2: OpenUserJS
1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Visit the script page on [OpenUserJS](https://openuserjs.org/)
3. Click "Install"

### Method 3: Manual Installation
1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click the Tampermonkey icon → "Create a new script"
3. Copy the entire contents of `universal-ad-blocker.user.js`
4. Paste into the editor and save (Ctrl+S or Cmd+S)

## How to Publish to Tampermonkey Sites

### Publishing to Greasy Fork
1. Create an account at [greasyfork.org](https://greasyfork.org/)
2. Click "Post a Script" in the top navigation
3. Fill in the required information:
   - **Name**: Universal Ad Blocker Pro + Security Shield
   - **Description**: Comprehensive ad blocking and security protection across major websites
   - **Language**: English
   - **Script type**: Public
4. Paste the script code from `universal-ad-blocker.user.js`
5. Add tags: `ad blocker`, `ads`, `youtube`, `facebook`, `crypto miner`, `malware`, `fingerprinting`, `popup`, etc.
6. Click "Post Script"

### Publishing to OpenUserJS
1. Create an account at [openuserjs.org](https://openuserjs.org/)
2. Click "Submit a Script" from your profile
3. Upload the `universal-ad-blocker.user.js` file or paste the code
4. Fill in the metadata and description
5. Click "Submit"

### Setting Up Auto-Updates (GitHub)
For best practice, host your script on GitHub and use these URLs in the script metadata:

1. Create a GitHub repository
2. Upload `universal-ad-blocker.user.js` to the repo
3. Update these lines in the script:
   ```javascript
   // @homepage     https://github.com/YOURUSERNAME/universal-ad-blocker
   // @supportURL   https://github.com/YOURUSERNAME/universal-ad-blocker/issues
   // @updateURL    https://github.com/YOURUSERNAME/universal-ad-blocker/raw/main/universal-ad-blocker.user.js
   // @downloadURL  https://github.com/YOURUSERNAME/universal-ad-blocker/raw/main/universal-ad-blocker.user.js
   ```

## Configuration
The script works automatically after installation. No configuration needed.

## Troubleshooting
- **Ads still showing**: Some sites update their ad systems frequently. Report issues on GitHub.
- **Site broken**: Disable the script for specific sites in Tampermonkey settings.
- **Performance issues**: Adjust the `setInterval` timing from 500ms/1000ms to 2000ms.
- **Too many console logs**: Comment out console.log statements if they're distracting.

## Privacy & Security
- All blocking happens locally in your browser
- No data is sent to external servers
- No tracking or analytics in this script
- Protects against browser fingerprinting
- Blocks crypto miners and malware
- Prevents malicious redirects and popups

## Console Logging
The script logs blocked content to help you see what it's protecting you from:
- `[Blocked] Fetch request:` - Network requests blocked
- `[Security] Blocked crypto miner:` - Mining attempts stopped
- `[Security] Canvas fingerprinting attempt blocked` - Privacy protection
- `[Security] Blocked popup:` - Popup windows prevented
- `[Security] Blocked malicious script:` - Dangerous scripts stopped

## Contributing
Contributions are welcome! Submit issues or pull requests on GitHub.

## License
MIT License - Free to use and modify

## Disclaimer
This script is for educational purposes. Some websites rely on ad revenue to provide free content. Consider supporting your favorite creators and sites through other means.

## Version History
- **4.0.0**: Added comprehensive security features (crypto miners, malware, fingerprinting, popups)
- **3.0.0**: Universal ad blocking across multiple sites
- **2.0**: YouTube advanced blocking
- **1.0**: Initial YouTube ad blocker
