
async function analyzeSentiment(text) {
  const prompt = `
    你是一个情感分析专家，请对以下文本进行情感分析，并以JSON格式输出结果。分析内容包括：
    1. 整体情感倾向（积极、消极、中性）
    2. 主要情感类别（例如：开心、愤怒、悲伤、恐惧等）
    3. 情感强度（0-1之间的数值）
    4. 关键情感词（触发情感的词语及其出现次数）

    输入文本：
    ${text}

    输出格式：
    {
      "overall_sentiment": "positive|negative|neutral",
      "emotions": [
        {
          "type": "happy|sad|angry|fear|etc",
          "intensity": 0.0-1.0,
          "keywords": [
            {"word": "example", "count": 1}
          ]
        }
      ]
    }
  `;

  // 调用大语言模型API（这里假设使用xAI的API）
  const response = await fetch('https://api.xai.com/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const result = await response.json();
  return JSON.parse(result.output); // 假设返回的是JSON字符串
}

export { analyzeSentiment };