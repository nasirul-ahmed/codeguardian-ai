const { applyRuleBasedAnalysis } = require('../../src/analyzers/ruleBasedAnalyzer')

describe('ruleBasedAnalyzer', () => {
  test('detects console.log', () => {
    const code = 'console.log("debug");\nconst x = 1;'
    const issues = applyRuleBasedAnalysis(code, 'test.js')
    expect(issues).toHaveLength(1)
    expect(issues[0].type).toBe('style')
    expect(issues[0].message).toContain('console.log')
  })

  test('detects TODO comments', () => {
    const code = '// TODO: fix this\nconst x = 1;'
    const issues = applyRuleBasedAnalysis(code, 'test.js')
    expect(issues).toHaveLength(1)
    expect(issues[0].type).toBe('maintainability')
  })

  test('detects hardcoded secrets', () => {
    const code = 'const API_KEY = "sk-123456";'
    const issues = applyRuleBasedAnalysis(code, 'test.js')
    expect(issues).toHaveLength(1)
    expect(issues[0].type).toBe('security')
    expect(issues[0].severity).toBe('critical')
  })
})
