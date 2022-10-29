// =========================================================
// Get latest sale from bigseller
// =========================================================

function callApiSaleStat () {
  const response = UrlFetchApp.fetch("https://www.bigseller.com/api/v1/orderSalesStatistics.json", {
    method: "post",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Cookie": BIGSELLER_COOKIE
    },
    payload: ""
  });

  // Parse the JSON reply
  const json = response.getContentText()
  const data = JSON.parse(json)

  Logger.log('call_bigseller_api_inventory [resp]:'+ JSON.stringify(response.getContentText()))

  return data.data[0]
}

// =========================================================
// Get inventory & stock from bigseler 
// =========================================================

function callApiBigSellerInventory () {
  const response = UrlFetchApp.fetch("https://www.bigseller.com/api/v1/inventory/pageList.json", {
    method: "post",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Cookie": BIGSELLER_COOKIE
    },
    payload: "pageNo=1&pageSize=300&warehouseId=28129&searchType=skuName"
  });

  // Parse the JSON reply
  const json = response.getContentText()
  const data = JSON.parse(json)

  return data
}

// =========================================================
// Get products show on shopee
// =========================================================

function callApiProductShopee () {
  const baseUrl = 'https://www.bigseller.com/api/v1/product/listing/shopee/active.json';
  const params = {
    orderBy: 'create_time',
    desc: 'true',
    searchType: 'productName',
    inquireType: '0',
    shopeeStatus: 'live',
    status: 'active',
    pageNo: '1',
    pageSize: '50'
  }
  const response = UrlFetchApp.fetch(buildUrl(baseUrl, params), {
    method: 'get',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      'Cookie': BIGSELLER_COOKIE
    }
  })

  // Parse the JSON reply
  const json = response.getContentText()
  const decodedJson = JSON.parse(json)

  Logger.log('call_bigseller_api_product_shopee [resp]:'+ JSON.stringify(json))
  
  const products = decodedJson?.data?.page?.rows || []
  console.log(products)
  return products.reduce((total, cur) => {
    return total.concat(cur.variations.map(v => [ 
      cur.itemSku, v.variationSku, cur.name, v.originalPriceStr + ' THB', (v.priceStr || cur.priceStr) + ' THB',
      cur.link, cur.originalImage, v.stock, cur.itemSku
    ]))
  }, [])
}
