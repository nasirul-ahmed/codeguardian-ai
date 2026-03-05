function chunkCode(code, chunkSize = 500) {
  const lines = code.split('\n')
  const chunks = []

  // Try to chunk by functions/classes first
  const functionRegex =
    /(function\s+\w+|class\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>|async\s+function)/

  let currentChunk = []
  let currentChunkLines = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    currentChunk.push(line)
    currentChunkLines++

    // Check if we should end chunk
    const isFunctionEnd = line.includes('}') && !line.includes('{')
    const isChunkFull = currentChunkLines >= chunkSize

    if ((isFunctionEnd || isChunkFull) && currentChunkLines > 0) {
      chunks.push({
        content: currentChunk.join('\n'),
        startLine: i - currentChunkLines + 1,
        endLine: i + 1,
      })
      currentChunk = []
      currentChunkLines = 0
    }
  }

  // Add remaining lines
  if (currentChunkLines > 0) {
    chunks.push({
      content: currentChunk.join('\n'),
      startLine: lines.length - currentChunkLines,
      endLine: lines.length,
    })
  }

  return chunks
}

module.exports = { chunkCode }
