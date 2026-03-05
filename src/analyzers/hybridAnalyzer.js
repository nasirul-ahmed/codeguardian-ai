const { analyzeWithGPT } = require('./gptAnalyzer')
const { applyRuleBasedAnalysis } = require('./ruleBasedAnalyzer')

async function hybridAnalyze(code, language, filename) {
  const [aiIssues, ruleIssues] = await Promise.all([
    analyzeWithGPT(code, language),
    Promise.resolve(applyRuleBasedAnalysis(code, filename)),
  ])

  // Merge, deduplicate by line and message (simple)
  const allIssues = [...aiIssues, ...ruleIssues]
  const seen = new Set()
  const unique = []

  for (const issue of allIssues) {
    const key = `${issue.line}-${issue.message}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(issue)
    }
  }

  return unique
}

module.exports = { hybridAnalyze }
