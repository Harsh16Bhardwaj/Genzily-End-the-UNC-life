// GenZ Comment Booster - Background Script
// Handles extension lifecycle and messaging

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First install - open settings
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings.html')
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openSettings') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings.html')
    });
    sendResponse({ success: true });
  }

  return true;
});

// Listen for tab updates to inject content script on LinkedIn
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('linkedin.com')) {
    // Content script will auto-inject via manifest
    console.log('GenZ Booster: LinkedIn page loaded');
  }
});