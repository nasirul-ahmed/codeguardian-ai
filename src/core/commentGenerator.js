function generateInlineComments(issues, file) {
  return issues
    .filter((issue) => issue.line) // Only issues with line numbers
    .map((issue) => ({
      path: file.filename,
      line: issue.line,
      body: formatComment(issue),
      side: 'RIGHT', // Comment on the new version
    }))
}

function generateSummaryComment(allIssues) {
  const critical = allIssues.filter((i) => i.severity === 'critical').length
  const high = allIssues.filter((i) => i.severity === 'high').length
  const medium = allIssues.filter((i) => i.severity === 'medium').length
  const low = allIssues.filter((i) => i.severity === 'low').length

  const securityIssues = allIssues.filter((i) => i.type === 'security').length
  const bugIssues = allIssues.filter((i) => i.type === 'bug').length

  return `
## 🤖 AI Code Review Summary

### Overview
Found **${allIssues.length}** potential issues across ${new Set(allIssues.map((i) => i.file)).size} files.

### Severity Breakdown
- 🔴 **Critical**: ${critical}
- 🟠 **High**: ${high}
- 🟡 **Medium**: ${medium}
- 🔵 **Low**: ${low}

### Type Breakdown
- 🐛 **Bugs**: ${bugIssues}
- 🔒 **Security**: ${securityIssues}
- ⚡ **Performance**: ${allIssues.filter((i) => i.type === 'performance').length}
- 🏗️ **Architecture**: ${allIssues.filter((i) => i.type === 'architecture').length}
- 🎨 **Style**: ${allIssues.filter((i) => i.type === 'style').length}

### Top Critical Issues
${
  allIssues
    .filter((i) => i.severity === 'critical')
    .slice(0, 3)
    .map((i) => `- **${i.file}:${i.line}** - ${i.message}`)
    .join('\n') || 'None found'
}

### Recommendations
${generateRecommendations(allIssues)}

---
> ⚡ *This review was generated automatically by [CodeGuardian AI](https://github.com/yourusername/codeguardian-ai)*
`
}

function formatComment(issue) {
  const emojiMap = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵',
    bug: '🐛',
    security: '🔒',
    performance: '⚡',
    architecture: '🏗️',
    style: '🎨',
  }

  return `
${emojiMap[issue.severity] || '⚪'} **${issue.type?.toUpperCase()}** (${issue.severity})

${issue.message}

**💡 Suggestion:** ${issue.suggestion}

\`\`\`
${issue.code || 'No code snippet'}
\`\`\`
`
}

function generateRecommendations(issues) {
  if (issues.length === 0) {
    return 'Great job! No issues found. 🎉'
  }

  const recommendations = []

  if (issues.some((i) => i.type === 'security')) {
    recommendations.push('- 🔒 Consider a security review for the flagged issues')
  }

  if (issues.some((i) => i.type === 'performance')) {
    recommendations.push('- ⚡ Profile the performance-critical sections')
  }

  if (issues.filter((i) => i.type === 'style').length > 5) {
    recommendations.push('- 🎨 Consider setting up a linter to catch style issues automatically')
  }

  return recommendations.join('\n') || '- Review the flagged issues before merging'
}

module.exports = { generateInlineComments, generateSummaryComment }
