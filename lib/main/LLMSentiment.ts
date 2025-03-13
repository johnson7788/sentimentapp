import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

  try {
    const response = await openai.chat.completions.create({
      model: process.env.LLM_MODEL as string,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    
    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // 添加类型校验
    if (!isValidSentiment(result)) {
      throw new Error('Invalid sentiment analysis result');
    }
    
    return result;
  } catch (error) {
    console.error('情感分析失败:', error);
    throw error;
  }
}


// 类型守卫函数
function isValidSentiment(data: any) {
  return (
    typeof data.overall_sentiment === 'string' &&
    Array.isArray(data.emotions) &&
    data.emotions.every((e: any) => 
      typeof e.type === 'string' &&
      typeof e.intensity === 'number' &&
      Array.isArray(e.keywords)
    )
  );
}


export { analyzeSentiment };