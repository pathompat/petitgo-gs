function scrapePriceza() {
  const searchProducts = readListProductFromSheet()
  searchProducts.forEach(product => {
    const { row, keyword, priceMin, priceMax } = product

    // load page 1
    const resP1 = requestPriceza(keyword, 1, priceMin, priceMax)
    const productP1 = parseProductHtmlToList(resP1)

    // load page 2
    const resP2 =  requestPriceza(keyword, 2, priceMin, priceMax)
    const productP2 = parseProductHtmlToList(resP2)
    const listAllProducts = [ ...productP1, ...productP2 ]
    
    // group prices by channel
    const groupedByChannel = listAllProducts.reduce((acc, item) => {
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

    const shopee = statByChannel.find(e => e.channel === 'shopee')?.stats
    const lazada = statByChannel.find(e => e.channel === 'lazada')?.stats
    if (shopee && lazada) {
      updateStatByRange(row, { shopee, lazada })
    }
  })

}

function parseProductHtmlToList(htmlContent) {
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

function requestPriceza(keyword, page = 1, priceMin = 0, priceMax = 500) {
  const url = 'https://www.priceza.com/service/loadMore';

  const payload = {
    cmd: 'searchNextPage',
    page: page.toString(),
    productdataname: keyword,
    priceMin: priceMin.toString(),
    priceMax: priceMax.toString(),
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

  const { minPrice: smin, maxPrice: smax, modePrice: smod, medianPrice: smed  } = stat.shopee
  const { minPrice: lmin, maxPrice: lmax, modePrice: lmod, medianPrice: lmed } = stat.lazada
  const newData = [smin, smax, smod, smed, lmin, lmax, lmod, lmed]

  sheet.getRange(row, 6, 1, 8).setValues([newData])
  const currentTime = new Date()
  sheet.getRange('B1').setValue(currentTime)

  Logger.log(`update-data-sheet-competiton|req:${row}|resp:${JSON.stringify(newData)}`)
}