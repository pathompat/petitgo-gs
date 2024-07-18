// =========================================================
// Common function for sheet
// =========================================================

function md5 (input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input);
  var txtHash = '';
  for (i = 0; i < rawHash.length; i++) {
    var hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += '0';
    }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

function buildUrl(url, params) {
  const paramString = Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&')
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString
}

function fetchApi (url, method, headers, payload) {
  const options = {
    "method"  : method,
    "payload" : payload,
    "headers" : headers
  }
  if (method === 'GET') url = buildUrl(url, payload)
  return UrlFetchApp.fetch(url, options)
}

// Function to check date is today
function isToday(date) {
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}