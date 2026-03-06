const config = require('../utils/config');

function getAIProvider() {
  const providerName = config.ai.provider || 'openai';

  switch (providerName) {
    case 'openai':
      return require('./providers/openai');
    case 'puter':
      return require('./providers/puter');
    default:
      throw new Error(`Unknown AI provider: ${providerName}`);
  }
}

module.exports = { getAIProvider };
