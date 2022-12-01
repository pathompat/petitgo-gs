const categoriesMap = {
  'Cat Litters': 50,
  'Cat Dry Food': 40,
  'Shampoos & Bath Accessories': 51,
  'Cat Wet Food': 52
}

function formatProductLazada(productId) {
  const product = callApiGetProductLazada(productId)
  const productImages = product.mainImage.split(',')

  const variationMap = product.variations.map((variation, index) => {
    return {
      name: `${product.name} ${product.optionName1} ${variation.optionValue1}`,
      sku: variation.sellerSku,
      type: 'simple',
      regular_price: variation.priceStr,
      sale_price: variation.salePriceStr,
      description: product.productText.description,
      short_description: product.productText.shortDescription,
      categories: [
        {
          id: categoriesMap[product.categoryName]
        }
      ],
      images: [
        {
          src: variation.imageList[0]
        },
        ...productImages.map(imagePath => ({ src: imagePath }))
      ]
    }
  })

  Logger.log('mapping_lazada_product_to_woocommerce_format [resp]:'+ JSON.stringify(variationMap))

  return variationMap
}

function cloneProductToWoocommerce (bigsellerProductId) {
    const productVariations = formatProductLazada(bigsellerProductId)
    return productVariations.forEach(variation => {
      const response = UrlFetchApp.fetch('https://shop.pathompat.me/wp-json/wc/v3/products', {
        method: 'post',
        contentType: 'application/json',
        headers: {
          'Authorization': BASIC_AUTH_WOOCOMMERCE
        },
        payload: JSON.stringify(variation)
      })
      Logger.log('create_woocommerce_product [resp]:'+ JSON.stringify(response.getContentText()))
    })
}
