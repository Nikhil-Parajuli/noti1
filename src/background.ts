// Background service worker for the Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  // Initialize default preferences
  chrome.storage.sync.set({
    preferences: {
      governance: true,
      security: true,
      airdrops: true,
      upgrades: true
    }
  });

  // Set up alarm for periodic checks
  chrome.alarms.create('checkUpdates', {
    periodInMinutes: 5
  });
});

// Handle alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkUpdates') {
    checkForUpdates();
  }
});

async function checkForUpdates() {
  try {
    // Fetch preferences
    const { preferences } = await chrome.storage.sync.get(['preferences']);
    
    // Example notification (in production, this would come from your Web3 API)
    const notification = {
      id: Date.now().toString(),
      type: 'governance',
      title: 'New Governance Proposal',
      description: 'Vote on the latest protocol upgrade proposal',
      timestamp: Date.now(),
      priority: 'high',
      actionUrl: 'https://example.com/proposal'
    };

    // Store notification
    const { notifications = [] } = await chrome.storage.local.get(['notifications']);
    await chrome.storage.local.set({
      notifications: [notification, ...notifications].slice(0, 50) // Keep last 50 notifications
    });

    // Show Chrome notification
    chrome.notifications.create(notification.id, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: notification.title,
      message: notification.description,
      priority: 2
    });
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.storage.local.get(['notifications'], (result) => {
    const notification = result.notifications?.find((n: any) => n.id === notificationId);
    if (notification?.actionUrl) {
      chrome.tabs.create({ url: notification.actionUrl });
    }
  });
});