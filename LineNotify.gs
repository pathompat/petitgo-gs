// =========================================================
// Function send line notify (deprecated 31/03/2025)
// =========================================================

function sendLineNotify(message){
  const options = {
   	"method"  : "post",
   	"payload" : "message=" + message,
   	"headers" : {
      "Authorization" : "Bearer " + LINE_PIG_TOKEN
    }
  }
  return UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options)
}

// =========================================================
// Function send line messaging api to group
// =========================================================

function sendLineMessage(message) {
  const token = LINE_PIG_TOKEN;
  const url = 'https://api.line.me/v2/bot/message/push';

  const payload = {
    to: LINE_PIG_GROUP_ID,
    messages: [
      {
        type: 'text',
        text: message
      }
    ]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + token
    },
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
}
