const sendLineShopCreateProduct = async (request) => {
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