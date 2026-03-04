const { getOctokit, context } = require('@actions/github');
const core = require('@actions/core');

function getGitHubToken() {
  console.log('🔍 Checking for GITHUB_TOKEN...');
  console.log(' - process.env.GITHUB_TOKEN exists?', !!process.env.GITHUB_TOKEN);
  console.log(
    ' - core.getInput("github-token") =',
    core.getInput('github-token') ? 'present' : 'empty'
  );
  const token = process.env.GITHUB_TOKEN || core.getInput('github-token');
  if (!token) {
    throw new Error('GITHUB_TOKEN is required');
  }

  console.log('✅ Token found (length: ' + token.length + ')');
  return token;
}

function getOctokitClient() {
  return getOctokit(getGitHubToken());
}

async function postReviewComments(comments) {
  if (!comments || comments.length === 0) return;
  const octokit = getOctokit();
  const { owner, repo } = context.repo;
  const pullNumber = context.payload.pull_request.number;

  // Post each inline comment as a review comment
  for (const comment of comments) {
    await octokit.rest.pulls.createReviewComment({
      owner,
      repo,
      pull_number: pullNumber,
      body: comment.body,
      commit_id: context.payload.pull_request.head.sha,
      path: comment.path,
      line: comment.line,
      side: comment.side || 'RIGHT',
    });
  }
}

async function postSummaryComment(body) {
  const octokit = getOctokit();
  const { owner, repo } = context.repo;
  const pullNumber = context.payload.pull_request.number;

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body,
  });
}

module.exports = {
  getOctokit: getOctokitClient,
  context,
  postReviewComments,
  postSummaryComment,
};