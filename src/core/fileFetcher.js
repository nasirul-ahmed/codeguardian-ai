const { getOctokit, context } = require('../utils/githubClient');

async function getChangedFiles() {
  if (process.env.ACT_LOCAL_TEST === 'true') {
    console.log('🧪 Running in local test mode – using mock files');
    return [
      {
        filename: 'src/test.ts',
        status: 'modified',
        additions: 10,
        deletions: 2,
        changes: 12,
        content: 'console.log("hello");\nconst x = 1;\n// TODO: fix this',
        language: 'typescript',
        sha: 'mock-sha-1',
      },
      {
        filename: 'src/utils.js',
        status: 'added',
        additions: 5,
        deletions: 0,
        changes: 5,
        content: 'function add(a,b) { return a + b; }\nconsole.log(add(1,2));',
        language: 'javascript',
        sha: 'mock-sha-2',
      },
      {
        filename: 'src/app.py',
        status: 'modified',
        additions: 3,
        deletions: 1,
        changes: 4,
        content: 'print("hello")\npassword = "secret123"',
        language: 'python',
        sha: 'mock-sha-3',
      },
    ];
  }

  const octokit = getOctokit();
  const { owner, repo } = context.repo;

  console.log(context.payload);

  if (!context.payload.pull_request) {
    console.error('No pull_request found in event payload. Event name:', context.eventName);
    console.error('Payload keys:', Object.keys(context.payload));
    throw new Error('This action only works on pull_request events');
  }

  const pullNumber = context.payload.pull_request?.number;
  console.log(`🔍 Processing PR #${pullNumber} in ${owner}/${repo}`);

  // Get PR details
  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });

  // Get list of changed files
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber,
  });

  // Fetch full content of each file
  const changedFiles = await Promise.all(
    files.map(async (file) => {
      if (file.status === 'removed') return null;

      try {
        const { data: content } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.filename,
          ref: pullRequest.head.sha,
        });

        // Decode base64 content
        const decodedContent = Buffer.from(content.content, 'base64').toString('utf-8');

        return {
          filename: file.filename,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
          patch: file.patch,
          content: decodedContent,
          language: getLanguageFromFilename(file.filename),
          sha: file.sha,
        };
      } catch (error) {
        console.error(`Error fetching ${file.filename}:`, error);
        return null;
      }
    })
  );

  return changedFiles.filter((f) => f !== null);
}

function getLanguageFromFilename(filename) {
  const extensionMap = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.py': 'python',
    '.go': 'go',
    '.java': 'java',
    '.rs': 'rust',
  };

  const ext = '.' + filename.split('.').pop();
  return extensionMap[ext] || 'unknown';
}

module.exports = { getChangedFiles };
