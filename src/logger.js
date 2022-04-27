/* istanbul ignore file */
export function log (message, level = 'warn') {
  const logger = logLevels[level] || console.log

  logger(`[zeev-utils] ${message}`)
}

const logLevels = {
  warn: console.warn,
  error: console.error,
  log: console.log
}
