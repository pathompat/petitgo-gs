// =========================================================
// Function send line notify
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
