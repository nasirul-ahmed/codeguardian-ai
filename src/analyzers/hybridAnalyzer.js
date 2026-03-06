const { getAIProvider } = require('../ai/factory');
const logger = require('../utils/logger');
const { applyRuleBasedAnalysis } = require('./ruleBasedAnalyzer');

async function hybridAnalyze(code, language, filename) {
  const aiProvider = getAIProvider(); // since we added new providers, we need to get the provider instance

  const [aiIssues, ruleIssues] = await Promise.all([
    aiProvider.analyze(code, language), // now its a provider based analyzer
    Promise.resolve(applyRuleBasedAnalysis(code, filename)),
  ]);

  logger.debug(`AI issues: ${aiIssues.length}, Rule-based issues: ${ruleIssues.length}`);

  // Merge and deduplicate
  const allIssues = [...aiIssues, ...ruleIssues];
  const seen = new Set();
  const unique = [];

  for (const issue of allIssues) {
    const key = `${issue.line}-${issue.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(issue);
    }
  }

  return unique;
}

module.exports = { hybridAnalyze };
