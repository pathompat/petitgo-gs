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

// =========================================================
// Function notify sale stat
// =========================================================

function sendNotifySaleToLineGroup () {
  // get sale and neccessary data
  const saleStat = callApiSaleStat()
  const keyLatestStat = Object.keys(saleStat).reduce((latest, cur) => new Date(latest) > new Date(cur) ? latest : cur)
  const latestData = saleStat[keyLatestStat]

  // send message to line
  const message = `วันที่ ${keyLatestStat}\n📌 ขายได้ ${latestData.orderCount} ออเดอร์\n💰 ยอดขาย ${latestData.amount_str} บาท`
  const res = sendLineNotify(message)

  Logger.log('sendNotifySaleToLineGroup' + JSON.stringify(res))
  return res
}
