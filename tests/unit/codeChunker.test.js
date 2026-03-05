const { chunkCode } = require('../../src/core/codeChunker')

describe('codeChunker', () => {
  test('splits code into chunks of max size', () => {
    const lines = Array.from({ length: 1000 }, (_, i) => `line ${i}`)
    const code = lines.join('\n')
    const chunks = chunkCode(code, 300)
    expect(chunks.length).toBeGreaterThan(3)
    expect(chunks[0].content.split('\n').length).toBeLessThanOrEqual(300)
  })

  test('respects function boundaries when possible', () => {
    const code = `
function a() {
  console.log('a');
}

function b() {
  console.log('b');
  console.log('b2');
}
    `
    const chunks = chunkCode(code, 2) // small chunk size to force splits
    // Should split at function boundaries ideally
    expect(chunks.length).toBeGreaterThan(1)
  })
})
