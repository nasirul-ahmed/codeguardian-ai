const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const DEFAULT_CONFIG = {
  version: '1.0.0',
  review: {
    enabled: true,
    languages: ['typescript', 'javascript'],
    ignorePatterns: [
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
    ],
    maxFileSize: 100000,
    chunkSize: 500,
    maxComments: 10,
  },
  rules: {
    security: {
      sqlInjection: true,
      hardcodedSecrets: true,
      unsafeEval: true,
    },
    style: {
      consoleLog: 'warning',
      todoComments: 'warning',
      debugger: 'error',
    },
    performance: {
      largeBundles: true,
      inefficientLoops: true,
    },
  },
  ai: {
    model: 'gpt-4',
    temperature: 0.3,
    maxTokens: 2000,
    focusAreas: ['bugs', 'security', 'architecture', 'performance'],
    responseFormat: { type: 'json_object' },
    message: {
      role: 'system',
      content: 'You are an expert code reviewer. Always return valid JSON.',
    },
    promptTemplate: `
    You are an expert {language} code reviewer. Review this code and find:

    1. **CRITICAL BUGS** (Null pointers, race conditions, logic errors)
    2. **SECURITY ISSUES** (SQL injection, XSS, hardcoded secrets)
    3. **PERFORMANCE PROBLEMS** (N+1 queries, memory leaks)
    4. **ARCHITECTURE ISSUES** (Tight coupling, single responsibility)
    5. **CODE SMELLS** (Duplication, long methods, complex conditions)

    Return JSON format:
    {
      "issues": [
        {
          "type": "bug|security|performance|architecture|style",
          "severity": "critical|high|medium|low",
          "line": number,
          "message": "clear description",
          "suggestion": "how to fix it",
          "code": "relevant code snippet"
        }
      ],
      "summary": {
        "totalIssues": number,
        "criticalCount": number,
        "highCount": number
      }
    }

    CODE TO REVIEW: \`\`\`{language} 
    {code} \`\`\``,
  },
  output: {
    inlineComments: true,
    summaryComment: true,
    reviewBadge: true,
  },
};

function loadConfig() {
  try {
    const configPath = core.getInput('config-path') || '.review.config.json';
    const fullPath = path.join(process.env.GITHUB_WORKSPACE || process.cwd(), configPath);

    if (fs.existsSync(fullPath)) {
      const userConfig = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      // Deep merge (simple version)
      return {
        ...DEFAULT_CONFIG,
        ...userConfig,
        review: { ...DEFAULT_CONFIG.review, ...userConfig.review },
      };
    }
  } catch (error) {
    console.warn('Could not load config file, using defaults:', error.message);
  }
  return DEFAULT_CONFIG;
}

const config = loadConfig();
module.exports = config;
