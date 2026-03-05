const { getChangedFiles } = require('./core/fileFetcher');
const { filterFiles } = require('./core/fileFilter');
const { chunkCode } = require('./core/codeChunker');
const { hybridAnalyze } = require('./analyzers/hybridAnalyzer');
const { generateInlineComments, generateSummaryComment } = require('./core/commentGenerator');
const { formatMarkdownSummary } = require('./formatters/markdownFormatter');
const { formatJSON } = require('./formatters/jsonFormatter');
const { postReviewComments, postSummaryComment } = require('./utils/githubClient');
const config = require('./utils/config');
const logger = require('./utils/logger');
const core = require("@actions/core")

async function run() {
  try {
    logger.info('Starting AI Code Review...');

    const changedFiles = await getChangedFiles();
    logger.info(`Found ${changedFiles.length} changed files`);

    const relevantFiles = filterFiles(changedFiles, config);
    logger.info(`${relevantFiles.length} files relevant for review`);
    
    const allIssues = [];

    for (const file of relevantFiles) {
      logger.info(`🔍 Analyzing ${file.filename}...`);
      const chunks = chunkCode(file.content, config.review.chunkSize);

      // Analyze each chunk with hybrid analyzer (GPT + rule based)
      for (const chunk of chunks) {
        const issues = await hybridAnalyze(chunk.content, file.language, file.filename);
        issues.forEach((issue) => {
          issue.file = file.filename;
          if (issue.line) issue.line += chunk.startLine;
        });
        allIssues.push(...issues);
      }
    }

    // Limit comments based on the configuration
    const limitedIssues = allIssues.slice(0, config.review.maxComments);

    // Generate outputs
    if (limitedIssues.length > 0) {
      const inlineComments = generateInlineComments(limitedIssues, relevantFiles);

      const summary = generateSummaryComment(limitedIssues);

      const jsonOutput = formatJSON(limitedIssues, {
        total: limitedIssues.length,
        files: relevantFiles.length,
      });

      logger.debug('JSON output:', jsonOutput);

      // Post to GitHub (skip in local test mode)
      if (process.env.ACT_LOCAL_TEST !== 'true') {
        await postReviewComments(inlineComments);
        await postSummaryComment(summary);
        logger.info('Comments posted to PR');
      } else {
        logger.info('Local test mode – skipping GitHub posting');
        logger.info('Summary would be:\n' + summary);
      }
    } else {
      logger.info('No issues found!');
    }

    logger.info('AI Code Review completed successfully!');
  } catch (error) {
    logger.error('Review failed:', error);
    core.setFailed(`Action failed: ${error.message}`);
    process.exit(1);
  }
}

run();
