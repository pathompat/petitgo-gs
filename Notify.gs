// =========================================================
// Function notify sale stat
// =========================================================

function sendNotifySaleStat () {

  const { cookie, latestNotifiedAt } = fetchBigsellerToken(propName = 'BIGSELLER_COOKIE')
  
  // get sale and neccessary data
  const saleStat = callApiSaleStat(cookie)

  // check notified within today yet
  if (isToday(latestNotifiedAt)) return

  const keyLatestStat = Object.keys(saleStat).reduce((latest, cur) => new Date(latest) > new Date(cur) ? latest : cur)
  const latestData = saleStat[keyLatestStat]

  const message = `วันที่ ${keyLatestStat}\n📌 ขายได้ ${latestData.orderCount} ออเดอร์\n💰 ยอดขาย ${latestData.amount_str} บาท`

  // send message to line
  const resLine = sendLineNotify(message)
  Logger.log('sendNotifySaleToLineGroup' + JSON.stringify(resLine))

  // send message to discord
  const resDiscord = sendDiscordNotification(WEBHOOK_PETITGO_NOTIFY, message)
  Logger.log('sendNotifySaleToDiscordChannel' + JSON.stringify(resDiscord))

  // update notified date on firebase
  updateLatestNotifiedAt()
  
  return { resLine, resDiscord }
}
