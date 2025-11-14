function updateSheetCompetitivePrice() {
  const searchProducts = readListProductFromSheet()
  const bigsellerShopee = callApiListProductShopee()
  const bigsellerLazada = callApiListProductLazada()
  const bigsellerTiktok = callApiListProductTiktok()
  if (bigsellerShopee.length === 0 || bigsellerLazada.length === 0 || bigsellerTiktok.length === 0) return

  searchProducts.forEach(product => {
    const { sku, name, row, keyword, priceMin, priceMax } = product

    // load all channel compare price list
    const channelList = ['LAZADA', 'Shopee', 'TikTok Shop']
    const allComparePriceList = channelList.reduce((newList, channel) => {
      const res = requestPriceza(keyword, 1, priceMin, priceMax, channel)
      const priceList = scrapePriceza(res) || []
      return newList.concat(priceList)
    }, [])
    
    // group prices by channel
    const groupedByChannel = allComparePriceList.reduce((acc, item) => {
      if (!acc[item.channel.toLowerCase()]) {
        acc[item.channel.toLowerCase()] = []
      }
      acc[item.channel.toLowerCase()].push(item.priceFloat)
      return acc
    }, {})

    const statByChannel = []
    for (const channel in groupedByChannel) {
      const prices = groupedByChannel[channel];
      const stats = findProductStatistics(prices)
      statByChannel.push({ channel, stats })
    }
    
    const mappingSkuShopee = bigsellerShopee.find(e => e.itemSku === sku)
    const mappingSkuLazada = bigsellerLazada.find(e => e.parentSku === sku)

    const shopee = statByChannel.find(e => e.channel === 'shopee')?.stats || {}
    if (mappingSkuShopee) {
      shopee.storePrice = mappingSkuShopee.price || null
    }
    const lazada = statByChannel.find(e => e.channel === 'lazada')?.stats || {}
    if (mappingSkuLazada) {
      // lazada limit: cannot select product price use max sale price instead
      lazada.storePrice = Math.max(...mappingSkuLazada.variations.filter(p => p.salePrice).map(p => parseFloat(p.salePrice)), 0) || null
    }

    const tiktok = statByChannel.find(e => e.channel === 'tiktok shop')?.stats || {}
    const mappingSkuTiktok = bigsellerTiktok.find(product => product.name === name)
    if (mappingSkuTiktok) {
      // tiktok limit: cannot select product price use max price instead
      tiktok.storePrice = Math.max(...mappingSkuTiktok.variations.map(p => parseFloat(p.promotionPrice)), 0) || null
    }
    if (shopee && lazada && tiktok) {
      updateStatByRange(row, { shopee, lazada, tiktok })
    }
  })

}

function scrapePriceza(htmlContent) {
  const $ = Cheerio.load(htmlContent)

  const compareList = []
  $('div.pz-pdb-item').each(function() {
    const name = $(this).find('div.pz-pdb_name.pdbThumbnailName').text().trim()
    const channels = $(this).find('span.pz-pdb_merchant-seller')
    const channel = channels.length >= 0 ? $(channels[0]).text().trim() : ''
    const price = $(this).find('span.pz-pdb-price')
    const priceNum = $(price).find('span:not(.pdb-price-unit)').text().trim().replace(/\,/g,'')
    
    const priceFloat = parseFloat(priceNum)
    if(!isNaN(priceFloat)) {
      compareList.push({ name, priceFloat, channel })
    }
  })
  return compareList
}

function requestPriceza(keyword, page = 1, priceMin = 0, priceMax = 500, channel) {
  const url = 'https://www.priceza.com/service/loadMore';

  const payload = {
    cmd: 'searchNextPage',
    page: page.toString(),
    productdataname: keyword,
    priceMin: priceMin.toString(),
    priceMax: priceMax.toString(),
    merchant: channel
  }

  const options = {
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    payload: payload,
    muteHttpExceptions: true
  }
  const res = UrlFetchApp.fetch(url, options).getContentText()
  Logger.log(`request-priceza-api-loadmore|req:${JSON.stringify(options)}|resp:${JSON.stringify(res)}`)

  return res
}

function findProductStatistics(prices){

  // find min, max
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  // find mode
  const frequency = {}
  let modePrice = prices[0]
  let maxCount = 0
  
  prices.forEach(price => {
    frequency[price] = (frequency[price] || 0) + 1
    if (frequency[price] > maxCount) {
      maxCount = frequency[price]
      modePrice = price
    }
  })

  // find median
  prices.sort((a, b) => a - b)
  const mid = Math.floor(prices.length / 2)
  const medianPrice = prices.length % 2 === 0 ? (prices[mid - 1] + prices[mid]) / 2: prices[mid]

  return { minPrice, maxPrice, modePrice, medianPrice }
}

function readListProductFromSheet() {
  const spreadsheet = SpreadsheetApp.openById(COMP_SPREADSHEET_ID)
  const sheet = spreadsheet.getSheetByName(COMP_SHEET)
  const range = sheet.getRange(4, 1, sheet.getLastRow() - 3, 5)
  const data = range.getValues()
  Logger.log(`get-data-sheet-competiton|req:|resp:${JSON.stringify(data)}`)
  return data.map((e, i) => ({
    row: i + 4,
    sku: e[0],
    name: e[1],
    keyword: e[2],
    priceMin: e[3],
    priceMax: e[4]
  }))
}

function updateStatByRange(row, stat) {
  const spreadsheet = SpreadsheetApp.openById(COMP_SPREADSHEET_ID)
  const sheet = spreadsheet.getSheetByName(COMP_SHEET)

  const { minPrice: smin, maxPrice: smax, modePrice: smod, medianPrice: smed, storePrice: sprice } = stat.shopee
  const { minPrice: lmin, maxPrice: lmax, modePrice: lmod, medianPrice: lmed, storePrice: lprice } = stat.lazada
  const { minPrice: tmin, maxPrice: tmax, modePrice: tmod, medianPrice: tmed, storePrice: tprice } = stat.tiktok
  const newData = [ smin, smax, smod, smed, lmin, lmax, lmod, lmed, tmin, tmax, tmod, tmed, lprice, sprice, tprice ]

  sheet.getRange(row, 6, 1, 15).setValues([newData])
  const currentTime = new Date()
  sheet.getRange('B1').setValue(currentTime)

  Logger.log(`update-data-sheet-competiton|req:${row}|resp:${JSON.stringify(newData)}`)
}