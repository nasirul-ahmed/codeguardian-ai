const config = require('../../utils/config');
const logger = require('../../utils/logger');
// const open = require('open');
// const { IncomingMessage } = require('node:http');

async function analyze(code, language) {
  let prompt = config.ai.prompt.puter;
  prompt = prompt.replace(/{language}/g, language).replace(/{code}/g, code);

  try {
    const modelName = mapModel(config.ai.model);
    const puter = await import('@heyputer/puter.js');

    const puterModule = puter.puter || puter.default || puter;

    if (!puterModule) {
      console.error(Object.keys(puterModule));
      return [];
    }

    // const newToken = await getAuthToken();

    puterModule?.setAuthToken(process.env.PUTER_TOKEN);

    const response = await puterModule.ai.chat(prompt, {
      model: modelName,
      max_tokens: config.ai.maxTokens,
    });

    console.log('Puter.js response:', response);

    const analysis = JSON.parse(response);

    console.log('Puter.js analysis:', analysis);
    return analysis.issues || [];
  } catch (error) {
    console.error('Puter.js analysis failed:', error);
    return [];
  }
}

function mapModel(userModel) {
  const map = {
    'gpt-4': 'gpt-5.2-chat',
    'gpt-3.5-turbo': 'gpt-5.1-chat-latest',
    'gpt-4-turbo': 'gpt-5.2-pro',
    // ... add more mappings as needed
  };
  return map[userModel] || 'gpt-5.2-chat'; // fallback
}

function cleanJSON(text) {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}

// const getAuthToken = (guiOrigin = 'https://puter.com') => {
//   const http = require('http');

//   return new Promise((resolve) => {
//     const requestListener = function (/**@type {IncomingMessage} */ req, res) {
//       res.writeHead(200, { 'Content-Type': 'text/html' });
//       res.end(`<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Authentication Successful - Puter</title>
//     <style>
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
//         body {
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
//             background: #404C71;
//             min-height: 100vh;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//         }
//         .container {
//             background: white;
//             border-radius: 16px;
//             padding: 48px;
//             text-align: center;
//             box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
//             max-width: 420px;
//             margin: 20px;
//         }
//         .checkmark {
//             width: 80px;
//             height: 80px;
//             background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             margin: 0 auto 24px;
//             animation: scaleIn 0.5s ease-out;
//         }
//         .checkmark svg {
//             width: 40px;
//             height: 40px;
//             stroke: white;
//             stroke-width: 3;
//             fill: none;
//             animation: drawCheck 0.6s ease-out 0.3s forwards;
//             stroke-dasharray: 50;
//             stroke-dashoffset: 50;
//         }
//         @keyframes scaleIn {
//             0% { transform: scale(0); }
//             50% { transform: scale(1.2); }
//             100% { transform: scale(1); }
//         }
//         @keyframes drawCheck {
//             to { stroke-dashoffset: 0; }
//         }
//         h1 {
//             color: #1a1a2e;
//             font-size: 24px;
//             font-weight: 600;
//             margin-bottom: 12px;
//         }
//         p {
//             color: #64748b;
//             font-size: 16px;
//             line-height: 1.6;
//         }
//         .puter-logo {
//             margin-top: 32px;
//             opacity: 0.6;
//             font-size: 14px;
//             color: #94a3b8;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="checkmark">
//             <svg viewBox="0 0 24 24">
//                 <polyline points="20 6 9 17 4 12"></polyline>
//             </svg>
//         </div>
//         <h1>Authentication Successful</h1>
//         <p>You're all set! You may now close this window and return to your terminal.</p>
//         <div class="puter-logo">Powered by Puter</div>
//     </div>
//     <script>
//         // Automatically close the window after 5 seconds
//         setTimeout(() => { 
//           const approve = document.querySelector('.authme-approve');
//             if (approve) approve.click();
//           }, 2000);
//     </script>
// </body>
// </html>`);

//       resolve(new URL(req.url, 'http://localhost/').searchParams.get('token'));
//     };
//     const server = http.createServer(requestListener);
//     server.listen(0, async function () {
//       const url = `${guiOrigin}/?action=authme&redirectURL=${encodeURIComponent('http://localhost:') + this.address().port}`;
//       (await open.default(url)).addListener('onload', () => {
//         setTimeout(() => {
//           const d = document.querySelector('.authme-approve');
//           if (d) {
//             d.click();
//           }
//         }, 5000);
//       });
//     });
//   });
// };

// getAuthToken()
//   .then((token) => console.log('Obtained Puter.js auth token:', token))
//   .catch((err) => console.error('Failed to obtain Puter.js auth token:', err));

module.exports = { analyze };
