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

function replaceProducts(products) {

  const collectionName = "products"
  const documents = firestore.getDocuments(collectionName);
  
  if (documents.length === 0) {
    Logger.log('get_all_product_from_firestore [resp]: no documents found in the products.')
  }

  // remove all product in collections
  documents.forEach(function(doc) {
    firestore.deleteDocument(`${collectionName}/${doc.name}`);
    Logger.log('removed_product_from_firestore [resp]: id: ' + doc.name)
  })
  
  // insert product to collections
  products.forEach(product => {
    firestore.createDocument(collectionName, product)
    Logger.log(`created_product_from_firestore [resp]: created ${product?.parentsku}`)
  })

  Logger.log(`replaced_product_from_firestore [resp]: removed: ${documents.length} created: ${products.length}`)
  return products.length
}

function insertVariationJson(){
  // example json: [{"variationName":"ทูน่า-น้ำมันมะพร้าว","sellerSku":"PIG-TR-05-480G-TCO"}]
  const jsonVar = JSON.parse(`================ fill json here =====================`)

  // insert variations to collections
  jsonVar.forEach(variation => {
    firestore.createDocument('variations', {
      sku: variation.sellerSku,
      name: variation.variationName
    })
  })

  Logger.log(`insert_variations_to_firestore [resp]: created: ${jsonVar}`)
  return jsonVar.length
}

function getVariations() {
  const variations = firestore.query("variations").Execute()
  Logger.log('get_variations_from_firestore [resp]:'+ JSON.stringify(variations))
  return variations
}
