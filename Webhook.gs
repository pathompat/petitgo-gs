const insertProductWithVariants = async () => {
  const bigsellerProductId = 27508721
  const bigseller = await callApiGetProductLazada(bigsellerProductId)

  const variantOptions = {
    option1: {
      data: bigseller.variations.map(v => ({ imageUrl: v.imageList[0], value: v.optionValue1 })),
      name: "สูตร"
    }
  }
  const variants = bigseller.variations.map((v, i) => ({
    onHandNumber: 0,
    options: [i],
    price: v.price,
    sku: v.sellerSku,
    weight: Number(parseFloat(v.packageWeight).toFixed(2))
  }))
  
  const lineShoppingReq = {
    brand: bigseller.brand,
    categoryId: convertToLineCategory(bigseller.categoryName),
    code: bigseller.productSku,
    description: cleanDescription(bigseller.productText.description),
    imageUrls: bigseller.mainImage.split(",").slice(0, 7),
    instantDiscount: bigseller.variations?.[0]?.price - bigseller.variations?.[0]?.salePrice,
    name: bigseller.name,
    variantOptions,
    variants
  };
  Logger.log('lineshopping_req [req]:'+ JSON.stringify(lineShoppingReq))

  const req = await sendLineShopCreateProduct(lineShoppingReq)
  Logger.log('call_lineshopping_api_create_product [resp]:'+ JSON.stringify(req))
}