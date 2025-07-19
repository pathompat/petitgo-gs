// every 1 week
// const updateCompetitiveSheet = () => {
//   updateSheetCompetitivePrice()
// }

// every 1 day
const updateMarketingSheet = async () => {
  const spreadsheet = SpreadsheetApp.openById(COMP_SPREADSHEET_ID)
  const sheet = spreadsheet.getSheetByName(MKT_SHEET)

  const shopeeProducts = await callApiListProductShopee()
  if (shopeeProducts.length === 0) return
  const lazadaProducts = await callApiListProductLazada()
  if (lazadaProducts.length === 0) return
  const lazadaProductVariations = lazadaProducts.flatMap(product => product.variations)
  const tiktokProducts = await callApiListProductTiktok()
  if (tiktokProducts.length === 0) return
  const tiktokProductsVariations = tiktokProducts.flatMap(product => product.variations)
  const skuMap = await callApiGetSkuMapping()
  if (skuMap.length === 0) return
  const variationsFlatMap = skuMap.flatMap(sku => sku.variationList)
  const inventory = await callApiBigSellerInventory()
  if (inventory.length === 0) return

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
      const recPriceShopee = inventoryCost * 1.12 * 1.1 * 1.01 // Reference: Shopee
      const recPriceLazada = inventoryCost * 1.145 * 1.1 * 1.01 // Reference: Lazada
      const recPriceTiktok = inventoryCost * 1.1248 * 1.1 * 1.01 // Reference: Tiktok

      const lazada = lazadaProductVariations.find(laz => laz.sellerSku === variation.variationSku)
      const tiktok = tiktokProductsVariations.find(tiktok => tiktok.sellerSku === variation.variationSku)
      const rowData = [
        product.itemSku,
        product.name,
        variation.variationSku,
        variationMap?.variationName,
        variation.stock,
        inventoryMap?.cost ? parseFloat(inventoryMap?.cost) : null,
        recPriceShopee,
        variation.originalPrice,
        variation.price,
        recPriceLazada,
        lazada?.price,
        lazada?.salePrice,
        recPriceTiktok,
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
