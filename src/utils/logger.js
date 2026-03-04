const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const currentLevel = process.env.LOG_LEVEL || 'info';

// If LOG_ENGINE === 'pino', use pino
let pino;
if (process.env.LOG_ENGINE === 'pino') {
  pino = require('pino')({
    level: currentLevel,
    formatters: {
      level: (label) => ({ level: label })
    }
  });
}

function log(level, message, ...args) {
  if (process.env.LOG_ENGINE === 'pino') {
    pino[level](message, ...args);
    return;
  }

  if (LOG_LEVELS[level] >= LOG_LEVELS[currentLevel]) {
    const timestamp = new Date().toISOString();
    console[level === 'error' ? 'error' : 'log'](
      `[${timestamp}] [${level.toUpperCase()}] ${message}`,
      ...args
    );
  }
}

module.exports = {
  debug: (msg, ...args) => log('debug', msg, ...args),
  info: (msg, ...args) => log('info', msg, ...args),
  warn: (msg, ...args) => log('warn', msg, ...args),
  error: (msg, ...args) => log('error', msg, ...args)
};