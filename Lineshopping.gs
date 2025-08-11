const callLineShopApiCreateProduct = async (request) => {
  const options = {
   	"method"  : "post",
   	"payload" : JSON.stringify(request),
   	"headers" : {
      "Content-Type": "application/json",
      "X-API-KEY" : LINE_SHOPPING_TOKEN
    }
  }
  const response = await UrlFetchApp.fetch(`${LINE_SHOPPING_BASE_PATH}/myshop/v1/products`, options)
  const json = response.getContentText()
  const data = JSON.parse(json)
  return await data
}

const callLineShopApiUpdateInventory = async (inventoryId, quantity) => {
  const options = {
   	"method"  : "put",
   	"payload" : JSON.stringify({
      amount: quantity
    }),
   	"headers" : {
      "Content-Type": "application/json",
      "X-API-KEY" : LINE_SHOPPING_TOKEN
    }
  }
  const response = await UrlFetchApp.fetch(`${LINE_SHOPPING_BASE_PATH}/myshop/v1/inventory/${inventoryId}/adjust`, options)
  const json = response.getContentText()
  const data = JSON.parse(json)
  Logger.log(`lineshopping_api_adjust_inventory [res]: inv-${inventoryId}, qty-${quantity}, [res]: ${JSON.stringify(data)}`)
  return data
}

const callLineShopApiGetAllProduct = async () => {
  const options = {
   	"method"  : "get",
   	"headers" : {
      "Content-Type": "application/json",
      "X-API-KEY" : LINE_SHOPPING_TOKEN
    }
  }
  const response = await UrlFetchApp.fetch(`${LINE_SHOPPING_BASE_PATH}/myshop/v1/products?perPage=50`, options)
  const json = response.getContentText()
  const resJson = JSON.parse(json)
  return resJson?.data
}