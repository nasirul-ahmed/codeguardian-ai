# 🤖 CodeGuardian AI – AI‑Powered Code Review for GitHub PRs

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-CodeGuardian%20AI-blue?logo=github)](https://github.com/marketplace/actions/codeguardian-ai)
[![CI](https://github.com/nasirul-ahmed/codeguardian-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/nasirul-ahmed/codeguardian-ai/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-20.x-green)](https://nodejs.org)

**CodeGuardian AI** automatically reviews your pull requests using OpenAI’s GPT models and a set of smart rules. It catches bugs, security issues, performance problems, and code smells before they reach production – all as inline comments and a summary on your PR.

![Example PR comment](./docs/example-comment.png) <!-- optional screenshot -->

---

## 🚀 Features

- 🔍 **Smart Code Analysis** – Uses GPT (configurable) to understand code context and find complex issues.
- 🎯 **Inline Comments** – Comments directly on problematic lines, just like a human reviewer.
- ⚡ **Performance Insights** – Detects N+1 queries, memory leaks, and inefficient loops.
- 🔒 **Security Scanning** – Finds hardcoded secrets, SQL injection risks, and unsafe eval.
- 🏗️ **Architecture Review** – Identifies tight coupling, single responsibility violations.
- 📊 **PR Summary** – A beautiful markdown summary with severity breakdown and recommendations.
- ⚙️ **Fully Configurable** – Customise rules, model, prompt, and output via a simple JSON file.
- 🧪 **Local Testing** – Use `act` to simulate the action without pushing to GitHub.

---

## 📦 Inputs

| Name             | Required | Description                                                                       |
| ---------------- | -------- | --------------------------------------------------------------------------------- |
| `github-token`   | ✅       | Automatically provided by GitHub Actions. Used to fetch files and post comments.  |
| `openai-api-key` | ✅       | Your OpenAI API key. Get one from [OpenAI](https://platform.openai.com/api-keys). |
| `config-path`    | ❌       | Path to the configuration file (default: `.review.config.json`).                  |

---

## 📤 Outputs

The action does not produce direct job outputs, but it creates:

- **Inline review comments** on the PR diff.
- A **summary comment** with statistics and recommendations.

---

## 🛠️ Example Usage

Add this workflow to your repository (`.github/workflows/code-review.yml`):

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: AI Code Review
        uses: nasirul-ahmed/codeguardian-ai@v1 # Replace with your actual repo
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          config-path: '.review.config.json' # Optional
```

## ⚠️ Important:

Store your OPENAI_API_KEY as a repository secret. The GITHUB_TOKEN is automatically provided.

## ⚙️ Configuration

Create a `.review.config.json` file in your repository root to customise the behaviour. All fields are optional – defaults are shown below.

```
{
  "review": {
    "languages": ["typescript", "javascript", "python"],
    "ignorePatterns": ["**/*.test.ts", "**/node_modules/**"],
    "maxFileSize": 100000,
    "chunkSize": 500,
    "maxComments": 10
  },
  "rules": {
    "security": {
      "sqlInjection": true,
      "hardcodedSecrets": true,
      "unsafeEval": true
    },
    "style": {
      "consoleLog": "warning",
      "todoComments": "warning",
      "debugger": "error"
    },
    "performance": {
      "largeBundles": true,
      "inefficientLoops": true
    }
  },
  "ai": {
    "model": "gpt-3.5-turbo",
    "temperature": 0.3,
    "maxTokens": 2000,
    "focusAreas": ["bugs", "security", "architecture", "performance"],
    "promptTemplate": "You are an expert {language} code reviewer... (see defaults in source)"
  },
  "output": {
    "inlineComments": true,
    "summaryComment": true
  }
}
```

## Configuration Options


| Key | Type | Description |
| :--- | :--- | :--- |
| `review.languages` | `array` | Languages to review (extensions mapped automatically). |
| `review.ignorePatterns` | `array` | Glob patterns to exclude. |
| `review.maxFileSize` | `number` | Maximum file size (bytes) to analyse. |
| `review.chunkSize` | `number` | Lines per chunk for large files. |
| `review.maxComments` | `number` | Max comments to post per PR. |
| `rules.*` | `object` | Enable/disable specific rule categories. |
| `ai.model` | `string` | OpenAI model to use (gpt-3.5-turbo, gpt-4, etc.). |
| `ai.promptTemplate` | `string` | Custom prompt (use `{language}` and `{code}` placeholders). |
| `output.*` | `boolean` | Toggle comment types. |

## 🧪 Local Development & Testing
You can test the action locally using `act`. This is invaluable for debugging without pushing to GitHub.
 1. Install act [(see installation guide)](https://nektosact.com/installation/index.html).
 2. Create a secrets file `.secrets` (never commit it):
    ```
    GITHUB_TOKEN=ghp_yourPersonalAccessToken
    OPENAI_API_KEY=sk-yourOpenAIKey
    ```
 3. Run with a mock event (bypasses real GitHub API):
    ```
    act pull_request -e tests/fixtures/pull_request_event.json --secret-file .secrets --env ACT_LOCAL_TEST=true
    ```
    The `ACT_LOCAL_TEST=true` flag uses mock file data, so you don't need a real PR.

    if above is not working for you try providing the github key and openapi key as input through command-line.
    try below version.
    ```
    act pull_request -e .\tests\fixtures\pull_request_event.json --secret-file .\.secrects --input github-token=ghp_yourGithubToken --input openai-api-key=sk-yourOpenAPI_KEy --env ACT_LOCAL_TEST=true
    ```

    `.\tests\fixtures\pull_request_event.json` is a mock pull request used for testing purpose only.
 4. Run against a real PR (requires a token with repo access):
    ```act pull_request --secret-file .secrets```
    
## 🤝 Contributing
Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License
This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgements
  - Built with OpenAI API
  - Powered by GitHub Actions
  - Inspired by the need for faster, smarter code reviews