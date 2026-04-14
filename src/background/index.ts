/**
 * TabNexus — Background Service Worker (Manifest V3)
 *
 * Responsibilities:
 * - Register context menus
 * - Listen for messages from the popup when logic needs to run outside it
 *
 * IMPORTANT: The service worker goes to sleep when idle.
 * Do not keep state in memory — use chrome.storage for persistence.
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'tabnexus-snap',
    title: 'TabNexus: Snap current session',
    contexts: ['all'],
  })
})

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'tabnexus-snap') {
    // Opening the popup programmatically is not possible in MV3,
    // but we can notify it if it is already open.
    chrome.runtime.sendMessage({ type: 'TRIGGER_SNAP' }).catch(() => {
      // Popup is not open — ignore
    })
  }
})
