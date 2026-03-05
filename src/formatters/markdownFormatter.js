function formatMarkdownSummary(issues, files) {
  const critical = issues.filter((i) => i.severity === 'critical').length
  const high = issues.filter((i) => i.severity === 'high').length
  const medium = issues.filter((i) => i.severity === 'medium').length
  const low = issues.filter((i) => i.severity === 'low').length

  const securityIssues = issues.filter((i) => i.type === 'security').length
  const bugIssues = issues.filter((i) => i.type === 'bug').length

  let markdown = `## 🤖 AI Code Review Summary\n\n`
  markdown += `### Overview\n`
  markdown += `Found **${issues.length}** potential issues across **${files}** files.\n\n`
  markdown += `### Severity Breakdown\n`
  markdown += `- 🔴 **Critical**: ${critical}\n`
  markdown += `- 🟠 **High**: ${high}\n`
  markdown += `- 🟡 **Medium**: ${medium}\n`
  markdown += `- 🔵 **Low**: ${low}\n\n`
  markdown += `### Type Breakdown\n`
  markdown += `- 🐛 **Bugs**: ${bugIssues}\n`
  markdown += `- 🔒 **Security**: ${securityIssues}\n`
  markdown += `- ⚡ **Performance**: ${issues.filter((i) => i.type === 'performance').length}\n`
  markdown += `- 🏗️ **Architecture**: ${issues.filter((i) => i.type === 'architecture').length}\n`
  markdown += `- 🎨 **Style**: ${issues.filter((i) => i.type === 'style').length}\n\n`

  const topCritical = issues.filter((i) => i.severity === 'critical').slice(0, 3)
  if (topCritical.length > 0) {
    markdown += `### Top Critical Issues\n`
    topCritical.forEach((i) => {
      markdown += `- **${i.file || 'unknown'}:${i.line}** - ${i.message}\n`
    })
    markdown += `\n`
  }

  markdown += `---\n> ⚡ *This review was generated automatically by [CodeGuardian AI](https://github.com/yourusername/codeguardian-ai)*\n`
  return markdown
}

module.exports = { formatMarkdownSummary }
