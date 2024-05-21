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
  Logger.log('get_cookie_from_firestore [resp]:'+ JSON.stringify(cookie))
  return cookie
}
