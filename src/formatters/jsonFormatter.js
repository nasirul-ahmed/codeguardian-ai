function formatJSON(issues, summary) {
  return JSON.stringify({ issues, summary }, null, 2);
}

module.exports = { formatJSON };