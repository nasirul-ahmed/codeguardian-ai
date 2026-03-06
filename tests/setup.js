process.env.GITHUB_REPOSITORY = 'owner/repo'
process.env.GITHUB_EVENT_PATH = './tests/fixtures/pull_request_event.json'

// Fake Mock @actions/github
jest.mock('@actions/github', () => ({
  context: {
    repo: () => ({ owner: 'owner', repo: 'repo' }),
    payload: {
      pull_request: {
        number: 1,
        head: { sha: 'abc123' },
      },
    },
  },
  getOctokit: jest.fn().mockReturnValue({
    rest: {
      pulls: {
        get: jest.fn().mockResolvedValue({ data: {} }),
        listFiles: jest.fn().mockResolvedValue({ data: [] }),
      },
      repos: {
        getContent: jest.fn().mockResolvedValue({ data: { content: '' } }),
      },
      issues: {
        createComment: jest.fn().mockResolvedValue({}),
      },
      pulls: {
        createReviewComment: jest.fn().mockResolvedValue({}),
      },
    },
  }),
}))

// Fake Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({ issues: [] }),
              },
            },
          ],
        }),
      },
    },
  }))
})
