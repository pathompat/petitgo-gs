// Firestore instance
const firestore = FirestoreApp.getFirestore(FIRESTORE_EMAIL, FIRESTORE_KEY, FIRESTORE_PROJECT_ID)

function getOrders() {
  const orders = firestore.query("orders").Where("id", "==", "TEST").Execute()
  Logger.log('get_order_from_firestore [resp]:'+ JSON.stringify(orders))
  return orders
}

function getCookie() {
  const result = firestore.query("cookies").Execute()
  const cookie = result?.[0]?.fields?.cookie?.stringValue
  const updatedAt = new Date(result?.[0]?.fields?.updatedAt?.timestampValue)
  const latestNotifiedAt = new Date(result?.[0]?.fields?.latestNotifiedAt?.timestampValue)
  Logger.log('get_cookie_from_firestore [resp]:'+ JSON.stringify({ cookie, updatedAt, latestNotifiedAt }))
  return { cookie, updatedAt, latestNotifiedAt }
}

function updateLatestNotifiedAt() {
  const documentPath = 'cookies/opUcESSobnMxGL6QOUSS'
  const now = new Date()
  const updatedData = {
    latestNotifiedAt: now
  }
  firestore.updateDocument(documentPath, updatedData, true)

  Logger.log(`Document ${documentPath} updated latest notified date: ${updatedData.latestNotifiedAt}`)
  return 
}
