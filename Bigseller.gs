// =========================================================
// Check user is logged in
// =========================================================

function callApiCheckLogin () {
  const response = UrlFetchApp.fetch("https://www.bigseller.com/api/v1/isLogin.json", {
    method: "get",
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

  Logger.log('call_bigseller_api_check_login [resp]:'+ JSON.stringify(response.getContentText()))

  return data?.data?.[0]
}

// =========================================================
// Get latest sale from bigseller
// =========================================================

function callApiSaleStat (cookie) {
  console.log(cookie)
  const response = UrlFetchApp.fetch("https://www.bigseller.com/api/v1/orderSalesStatistics.json", {
    method: "post",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Connection": "keep-alive",
      "DNT":1,
      "Referer": "https://www.bigseller.com/web/dashboard.htm",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Cookie": cookie
    },
    payload: ""
  });

  // Parse the JSON reply
  const json = response.getContentText()
  const data = JSON.parse(json)

  Logger.log('call_bigseller_sale_statistic [resp]:'+ JSON.stringify(response.getContentText()))

  return data?.data?.[0]
}

// =========================================================
// Get inventory & stock from bigseler 
// =========================================================

function callApiBigSellerInventory () {
  const BIGSELLER_COOKIE = env('BIGSELLER_COOKIE')
  const response = UrlFetchApp.fetch("https://www.bigseller.com/api/v1/inventory/pageList.json", {
    method: "post",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Cookie": BIGSELLER_COOKIE
    },
    payload: "pageNo=1&pageSize=300&searchType=skuName&orderBy=onHand&desc=0"
  });

  // Parse the JSON reply
  const json = response.getContentText()
  const data = JSON.parse(json)

  Logger.log('call_bigseller_api_inventory [resp]:'+ JSON.stringify(json))

  return data?.data?.page?.rows
}

// =========================================================
// Get list products on shopee
// =========================================================

function callApiListProductShopee () {
  const BIGSELLER_COOKIE = env('BIGSELLER_COOKIE')
  const baseUrl = 'https://www.bigseller.com/api/v1/product/listing/shopee/pageList.json';
  const params = {
    orderBy: 'create_time',
    desc: true,
    searchType: 'productName',
    inquireType: 0,
    shopeeStatus: 'live',
    status: 'active',
    pageNo: 1,
    pageSize: 50
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
  
  return decodedJson?.data?.page?.rows || []
}

// =========================================================
// Get list products on lazada
// =========================================================

function callApiListProductLazada (status = 'active') {
  const BIGSELLER_COOKIE = env('BIGSELLER_COOKIE')
  const baseUrl = 'https://www.bigseller.com/api/v1/product/listing/lazada/pageList.json';
  const statusParam = status === 'active'? { status: 'active', platformStatus: 'active' } : {}
  const params = {
    orderBy: 'create_time',
    desc: 'true',
    searchType: 'productName',
    inquireType: '0',
    pageNo: '1',
    pageSize: '100',
    ...statusParam
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

  Logger.log('call_bigseller_api_product_lazada [resp]:'+ JSON.stringify(json))

  return decodedJson?.data?.page?.rows || []
}

// =========================================================
// Get list products on tiktok
// =========================================================

function callApiListProductTiktok () {
  const BIGSELLER_COOKIE = env('BIGSELLER_COOKIE')
  const baseUrl = 'https://www.bigseller.com/api/v1/product/listing/tiktok/pageList.json';
  const params = {
    orderBy: 'create_time',
    desc: 'true',
    searchType: 'productName',
    inquireType: 0,
    bsStatus: 4,
    tiktokStatus: 4,
    status: 'active',
    pageNo: '1',
    pageSize: '100'
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

  Logger.log('call_bigseller_api_product_lazada [resp]:'+ JSON.stringify(json))
  
  return decodedJson?.data?.page?.rows || []
}

// =========================================================
// Get one products on lazada
// =========================================================

function callApiGetProductLazada (bigsellerProductId) {
  const BIGSELLER_COOKIE = env('BIGSELLER_COOKIE')
  const baseUrl = `https://www.bigseller.com/api/v1/product/listing/lazada/edit/${bigsellerProductId}.json`;

  const response = UrlFetchApp.fetch(baseUrl, {
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

  Logger.log('call_bigseller_api_product_lazada [resp]:'+ JSON.stringify(json))
  
  return decodedJson?.data?.product || []
}

// =========================================================
// Get SKU Mapping & Variations
// =========================================================

function callApiGetSkuMapping () {
  const BIGSELLER_COOKIE = env('BIGSELLER_COOKIE')
  const baseUrl = `https://www.bigseller.com/api/v1/inventory/sku/mapping/pageList.json`;
  const payload = {
    pageNo: 1,
    pageSize: 50,
    searchType: "sku",
    searchContent: "",
    inquireType: 0,
    mappingCode: "",
    platform: "shopee",
    shopIds: [],
    platformStatus: "",
    orderBy: "createTime",
    desc: 1
  }

  const response = UrlFetchApp.fetch(baseUrl, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      'Cookie': BIGSELLER_COOKIE
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  })

  // Parse the JSON reply
  const json = response.getContentText()
  const decodedJson = JSON.parse(json)

  Logger.log('call_bigseller_api_sku_mapping [resp]:'+ JSON.stringify(json))
  
  return decodedJson?.data?.rows || []
}

// =========================================================
// Get and update latest cookie from firestore
// =========================================================

function fetchBigsellerToken(propName = 'BIGSELLER_COOKIE') {

  // get firestore bigseller's cookie
  const cookieObj = getCookie()
  const cookie = cookieObj.cookie
  if (!cookie) return 

  // get and update latest cookie
  const scriptProperties = PropertiesService.getScriptProperties()
  const existedCookie = scriptProperties.getProperty(propName)
  if(cookie === existedCookie) return { cookie: existedCookie, ...cookieObj }
  scriptProperties.setProperty(propName, cookie)

  return cookieObj
}
