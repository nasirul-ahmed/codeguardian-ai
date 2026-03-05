describe('gptAnalyzer', () => {
  let mockCreate;
  let analyzeWithGPT;

  beforeEach(() => {
    jest.resetModules();

    // Mock the config module (correct relative path)
    jest.doMock('../../src/utils/config', () => ({
      ai: {
        promptTemplate: 'Review this {language} code:\n{code}',
        model: 'gpt-3.5-turbo',
        temperature: 0.3,
        maxTokens: 2000,
        responseFormat: { type: 'json_object' },
        message: { role: 'system', content: 'You are an expert code reviewer.' },
      },
    }));

    // Mock logger (optional)
    jest.doMock('../../src/utils/logger', () => ({
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }));

    mockCreate = jest.fn();
    jest.doMock('openai', () => {
      return jest.fn().mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }));
    });

    analyzeWithGPT = require('../../src/analyzers/gptAnalyzer').analyzeWithGPT;
  });

  afterEach(() => {
    jest.unmock('openai');
    jest.unmock('../../src/utils/config');
    jest.unmock('../../src/utils/logger');
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
