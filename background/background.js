// GenZ Comment Booster - Background Service Worker
console.log('GenZ Booster: Service worker loaded');

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('GenZ Booster: Extension installed/updated', details.reason);
  if (details.reason === 'install') {
    // First install - open settings
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings.html')
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('GenZ Booster: Message received', message);
  
  if (message.action === 'openSettings') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings.html')
    });
    sendResponse({ success: true });
    return true;
  }

  return false;
});