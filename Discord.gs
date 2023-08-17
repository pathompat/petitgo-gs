// =========================================================
// Function send discord notify
// =========================================================

function sendDiscordNotification(webhookUrl, message) {
  const payload = {
    "content": message
  }
  const options = {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  }
  return UrlFetchApp.fetch(webhookUrl, options)
}
