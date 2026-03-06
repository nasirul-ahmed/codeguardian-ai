// const OpenAI = require('openai');
// const config = require('../utils/config');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function analyzeWithGPT(code, language) {
//   let prompt = config.ai.promptTemplate;
//   prompt = prompt.replace(/{language}/g, language).replace(/{code}/g, code);

//   try {
//     const response = await openai.chat.completions.create({
//       model: config.ai.model,
//       messages: [
//         config.ai.message,
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//       temperature: config.ai.temperature,
//       max_tokens: config.ai.maxTokens,
//       response_format: config.ai.responseFormat,
//     });

//     const analysis = JSON.parse(response.choices[0].message.content);
//     return analysis.issues || [];
//   } catch (error) {
//     console.error('GPT Analysis failed:', error);
//     return [];
//   }
// }

// module.exports = { analyzeWithGPT };
