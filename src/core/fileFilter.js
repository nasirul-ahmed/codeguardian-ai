const minimatch = require('minimatch').minimatch;
const path = require('path');

function filterFiles(files, config) {
  const ignorePatterns = config.review.ignorePatterns;
  const allowedLanguages = config.review.languages;
  const maxFileSize = config.review.maxFileSize;

  return files.filter(file => {
    if (file.status === 'removed') return false;

    const filename = file.filename;

    for (const pattern of ignorePatterns) {
      if (minimatch(filename, pattern)) {
        return false;
      }
    }

    if (file.content && file.content.length > maxFileSize) {
      console.log(`Skipping ${filename}: file too large`);
      return false;
    }

    const ext = path.extname(filename).toLowerCase();
    const langMap = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
    };
    const language = langMap[ext];
    if (language && !allowedLanguages.includes(language)) {
      return false;
    }

    return true;
  });
}

module.exports = { filterFiles };