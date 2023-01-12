// Firestore instance
const firestore = FirestoreApp.getFirestore(FIRESTORE_EMAIL, FIRESTORE_KEY, FIRESTORE_PROJECT_ID)

function getOrders() {
  const orders = firestore.query("orders").Where("id", "==", "TEST").Execute()
  Logger.log('get_order_from_firestore [resp]:'+ JSON.stringify(orders))
  return orders
}
