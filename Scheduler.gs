// every 1 week
const updateCompetitiveSheet = () => {
  updateSheetCompetitivePrice()
}

// every 1 day
const updateFirebaseProductAndStock = async () => {
  const products = await callApiListProductLazada (status = 'active')
  const variationMap = await getVariations()
  const formatProducts = products.map(product => ({
    name: product.name,
    parentsku: product.parentSku,
    variations: product.variations.map(v => ({
      sku: v.sellerSku,
      skuTitle: variationMap.find(e => e.fields?.sku?.stringValue === v.sellerSku)?.fields?.name?.stringValue || null,
      price: v.salePrice || v.price,
      quantity: v.quantity
    }))
  }))
  
  const res = replaceProducts(formatProducts)
  Logger.log('update_firebase_product_and_stock: [resp]' + JSON.stringify(res))
}
