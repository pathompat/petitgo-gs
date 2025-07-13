// every 1 week
// const updateCompetitiveSheet = () => {
//   updateSheetCompetitivePrice()
// }

// every 1 day
const updateMarketingSheet = async () => {
  const spreadsheet = SpreadsheetApp.openById(COMP_SPREADSHEET_ID)
  const sheet = spreadsheet.getSheetByName(MKT_SHEET)

  const shopeeProducts = await callApiListProductShopee()
  const lazadaProducts = await callApiListProductLazada()
  const lazadaProductVariations = lazadaProducts.flatMap(product => product.variations)
  const tiktokProducts = await callApiListProductTiktok()
  const tiktokProductsVariations = tiktokProducts.flatMap(product => product.variations)
  const skuMap = await callApiGetSkuMapping()
  const variationsFlatMap = skuMap.flatMap(sku => sku.variationList)
  const inventory = await callApiBigSellerInventory()

  const startRow = 3
  const lastRow = sheet.getLastRow()
  if (lastRow >= startRow) {
    sheet.getRange(startRow, 1, lastRow - startRow + 1, sheet.getLastColumn()).clearContent()
  }
  shopeeProducts.forEach((product) => {
    product.variations.forEach((variation) => {
      const variationMap = variationsFlatMap.find(v => v.variationSku === variation.variationSku)
      const inventoryMap = inventory.find(inv => inv.sku === variation.variationSku)
      const inventoryCost = inventoryMap?.cost || 0
      const recommendPrice = inventoryCost * 1.145 * 1.1 * 1.01 // Reference: Lazada

      const lazada = lazadaProductVariations.find(laz => laz.sellerSku === variation.variationSku)
      const tiktok = tiktokProductsVariations.find(tiktok => tiktok.sellerSku === variation.variationSku)
      const rowData = [
        product.itemSku,
        product.name,
        variation.variationSku,
        variationMap?.variationName,
        variation.stock,
        inventoryMap?.cost,
        recommendPrice,
        variation.originalPrice,
        variation.price,
        lazada?.price,
        lazada?.salePrice,
        tiktok?.originalPrice,
        tiktok?.promotionPrice ? parseFloat(tiktok?.promotionPrice) : null
      ]
      sheet.appendRow(rowData)
    })
  })

  const currentTime = new Date()
  sheet.getRange('B1').setValue(currentTime)

  Logger.log(`update-data-sheet-marketing|req:|resp:${JSON.stringify(currentTime)}`)
}

// every 1 day
const updateFirebaseProductAndStock = async () => {
  const products = await callApiListProductLazada(status = 'active')
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
