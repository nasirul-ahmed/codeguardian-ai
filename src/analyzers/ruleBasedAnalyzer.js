const logger = require('../utils/logger');

function applyRuleBasedAnalysis(code, filename) {
  if (typeof code !== 'string') {
    logger.warn('ruleBasedAnalyzer: code is not a string for ${filename} (type: ${typeof code}');

    return [];
  }
  const issues = [];
  const lines = code.split('\n');

  // Rule 1: No console.log in production
  lines.forEach((line, index) => {
    if (line.includes('console.log') && !line.includes('//')) {
      issues.push({
        type: 'style',
        severity: 'low',
        line: index + 1,
        message: 'Remove console.log from production code',
        suggestion: 'Use a proper logging library or remove debugging statements',
        code: line.trim(),
      });
    }
  });

  // Rule 2: No TODO comments
  lines.forEach((line, index) => {
    if (line.includes('TODO') || line.includes('FIXME')) {
      issues.push({
        type: 'maintainability',
        severity: 'medium',
        line: index + 1,
        message: 'Address TODO/FIXME comments before merging',
        suggestion: 'Either implement the required changes or create a ticket',
        code: line.trim(),
      });
    }
  });

  // Rule 3: Check for hardcoded secrets (basic pattern)
  const secretPatterns = [
    /password\s*=\s*['"][^'"]+['"]/i,
    /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
    /secret\s*=\s*['"][^'"]+['"]/i,
    /token\s*=\s*['"][^'"]+['"]/i,
  ];

  lines.forEach((line, index) => {
    secretPatterns.forEach((pattern) => {
      if (pattern.test(line) && !line.includes('example') && !line.includes('placeholder')) {
        issues.push({
          type: 'security',
          severity: 'critical',
          line: index + 1,
          message: 'Potential hardcoded secret detected',
          suggestion: 'Use environment variables or a secret management service',
          code: line.trim(),
        });
      }
    });
  });

  // Rule 4: Long methods (> 50 lines)
  if (lines.length > 50) {
    issues.push({
      type: 'architecture',
      severity: 'medium',
      line: 1,
      message: `Method is too long (${lines.length} lines)`,
      suggestion: 'Break this method into smaller, focused functions',
      code: filename,
    });
  }

  return issues;
}

module.exports = { applyRuleBasedAnalysis };
