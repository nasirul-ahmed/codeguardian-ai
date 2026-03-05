describe('gptAnalyzer', () => {
  let mockCreate;
  let analyzeWithGPT;

  beforeEach(() => {
    // Reset module cache so we can re-require with a fresh mock
    jest.resetModules();

    // Create a fresh mock function for each test
    mockCreate = jest.fn();

    // Mock the 'openai' module before requiring the module under test
    jest.doMock('openai', () => {
      return jest.fn().mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));
    });

    // Now require the module – it will use the mock defined above
    analyzeWithGPT = require('../../src/analyzers/gptAnalyzer').analyzeWithGPT;
  });

  afterEach(() => {
    jest.unmock('openai');
  });

  test('returns issues from GPT response', async () => {
    const mockIssues = [{ type: 'bug', severity: 'high', line: 5, message: 'Test' }];

    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ issues: mockIssues }) } }],
    });

    const issues = await analyzeWithGPT('console.log("hello")', 'javascript');
    expect(issues).toEqual(mockIssues);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  test('handles API error gracefully', async () => {
    mockCreate.mockRejectedValue(new Error('API error'));

    const issues = await analyzeWithGPT('code', 'js');
    expect(issues).toEqual([]);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });
});
