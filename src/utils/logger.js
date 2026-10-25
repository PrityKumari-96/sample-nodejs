const formatTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, ...args) => {
    console.log(`[${formatTimestamp()}] [INFO] ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[${formatTimestamp()}] [WARN] ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[${formatTimestamp()}] [ERROR] ${message}`, ...args);
  },
  debug: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${formatTimestamp()}] [DEBUG] ${message}`, ...args);
    }
  },
};
