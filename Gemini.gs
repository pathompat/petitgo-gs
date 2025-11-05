function callGeminiSummarizeCompetitiveSheet(competitiveData) {

  // Prompt
  const preparedPrompt = `
    You are a product analyst.

    Analyze the following product price data in JSON and respond ONLY with a JSON array (no explanations).

    Each object in the response should include:
    - product_name: name of the product
    - store_price: current store price (numeric)
    - market_avg_price: average market price (numeric), calculated primarily from the mode (most frequent price) across platforms
    - difference_percent: percentage difference between store and market average (positive = store higher)
    - recommendation: short suggestion in Thai (e.g., "ลดราคาประมาณ 10%", "คงราคาเดิม", "พิจารณาเพิ่มโปรโมชั่น")

    Rules:
    1. Sort products by difference_percent in ascending order (the ones with lowest competitiveness — highest positive difference — come first).
    2. Return only the top 5 products with the highest store prices compared to market.
    3. Output must be a pure JSON array with no additional text.

    Input JSON:
    ${JSON.stringify(competitiveData, null, 2)}
    `;

  // Call gemini API
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

  const payload = {
    contents: [
      {
        parts: [
          { text: preparedPrompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0,
      thinkingConfig: {
        thinkingBudget: -1,
      },
      imageConfig: {
        image_size: "1K"
      },
    },
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      "x-goog-api-key": GEMINI_API_KEY,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const res = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(res.getContentText());
  Logger.log(`response_gemini [res]: ${JSON.stringify(data)}`);

  // AI response
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  Logger.log(`response_gemini_mapping [res]: ${reply}`);

  return safeParseJson(reply)
}

function safeParseJson(rawText) {
  const clean = rawText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    Logger.log('❌ JSON parse error: ' + err.message);
    return [];
  }
}