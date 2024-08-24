function scrapePriceza() {
  const listSearchProduct = [
    {
      keyword: 'purina 1.2 kg',
      searchParam: 'purina-1-2kg'
    },
  ]
  const resP1 = scrapePricezaFirstPage('purina-1-2kg')
  const productP1 = parseProductHtmlToList(resP1)
  

  const resP2 =  scrapePricezaNextPage('purina 1.2 kg')
  const productP2 = parseProductHtmlToList(resP2)
  const listAllProducts = [ ...productP1, ...productP2 ]

  console.log(findProductStatistics(listAllProducts))
}

function parseProductHtmlToList(htmlContent) {
  const $ = Cheerio.load(htmlContent)

  const compareList = []
  $('div.pz-pdb-item').each(function() {
    // const productCard = $(this)
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

function scrapePricezaFirstPage(searchParam) {
  // URL of the webpage to scrape
  const url = 'https://www.priceza.com/s/%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2/' + searchParam

  // Fetch the HTML content from the URL
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText()
  // const $ = Cheerio.load(res);
  // // console.log($.html())

  // const compareList = []
  // $('div.pz-pdb-item').each(function() {
  //   // const productCard = $(this)
  //   const name = $(this).find('div.pz-pdb_name.pdbThumbnailName').text().trim()
  //   const channels = $(this).find('span.pz-pdb_merchant-seller')
  //   const channel = channels.length >= 0 ? $(channels[0]).text().trim() : ''
  //   const price = $(this).find('span.pz-pdb-price')
  //   const priceNum = $(price).find('span:not(.pdb-price-unit)').text().trim().replace(/\,/g,'')
    
  //   const priceFloat = parseFloat(priceNum)
  //   if(!isNaN(priceFloat)) {
  //     compareList.push({ name, priceFloat, channel })
  //   }
  // })

  return res
}

function scrapePricezaNextPage(keyword) {
    var url = 'https://www.priceza.com/service/loadMore';
  
  var options = {
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    payload: {
      cmd: 'searchNextPage',
      page: '2',
      productdataname: keyword,
    },
    muteHttpExceptions: true
  };
  
  // var response = UrlFetchApp.fetch(url, options);
  const res = UrlFetchApp.fetch(url, options).getContentText()
  return res
}

function findProductStatistics(products){
  // Extract all priceFloat values
  const prices = products.map(item => item.priceFloat)

  // Find the minimum price
  const minPrice = Math.min(...prices)

  // Find the maximum price
  const maxPrice = Math.max(...prices)

  // Find the mode (most frequent price)
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

  // Sort prices in ascending order
  prices.sort((a, b) => a - b);

  // Calculate the median
  let medianPrice;
  const mid = Math.floor(prices.length / 2);

  if (prices.length % 2 === 0) {
    // If even number of prices, take the average of the two middle values
    medianPrice = (prices[mid - 1] + prices[mid]) / 2;
  } else {
    // If odd number of prices, take the middle value
    medianPrice = prices[mid];
  }

  return { minPrice, maxPrice, modePrice, medianPrice }
}