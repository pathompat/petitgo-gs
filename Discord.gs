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
    "payload": JSON.stringify(payload),
    muteHttpExceptions: true
  }
  const response = UrlFetchApp.fetch(webhookUrl, options)
  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText());
  Logger.log(JSON.stringify(response.getAllHeaders()));
  return response
}
