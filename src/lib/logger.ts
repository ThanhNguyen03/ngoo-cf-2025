import pino from 'pino'

type TLogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

// In prod: only 'error' and above → debug/info/warn are silent no-ops.
// In dev: all levels visible for structured debugging.
const isProd = process.env.NODE_ENV === 'production'
const level: TLogLevel = isProd ? 'error' : 'debug'

const rootLogger = pino({
  level,
  browser: {
    // Logs appear as readable console.log in dev tools, not raw JSON
    asObject: false,
  },
})

export function createLogger(context: string) {
  return rootLogger.child({ context })
}

export { rootLogger }
