const { filterFiles } = require('../../src/core/fileFilter')

describe('fileFilter', () => {
  const config = {
    review: {
      ignorePatterns: ['**/*.test.ts', '**/node_modules/**'],
      languages: ['typescript', 'javascript'],
      maxFileSize: 100000,
    },
  }

  const files = [
    { filename: 'src/app.ts', status: 'modified', content: 'x'.repeat(500) },
    { filename: 'src/app.test.ts', status: 'modified', content: 'test' },
    { filename: 'node_modules/foo.js', status: 'added', content: 'bar' },
    { filename: 'src/utils.js', status: 'modified', content: 'utils' },
    { filename: 'large.ts', status: 'added', content: 'x'.repeat(200000) },
  ]

  test('filters out ignored patterns', () => {
    const filtered = filterFiles(files, config)
    expect(filtered).toHaveLength(2)
    expect(filtered.map((f) => f.filename)).toEqual(['src/app.ts', 'src/utils.js'])
  })

  test('filters by file size', () => {
    const filtered = filterFiles(files, config)
    expect(filtered.find((f) => f.filename === 'large.ts')).toBeUndefined()
  })
})
