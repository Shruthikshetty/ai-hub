import { pinoLogger } from 'hono-pino'

const isDev = process.env.NODE_ENV === 'development'

// config for pino logger
export const appLogger = pinoLogger({
  pino: {
    enabled: isDev, // enable only in development
    level: 'debug',
    ...(isDev
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              singleLine: true,
              ignore: 'pid,hostname'
            }
          }
        }
      : {})
  },
  http: {
    reqId: () => crypto.randomUUID(),
    onReqBindings: (c) => ({
      req: {
        url: c.req.url
      }
    }),
    onResBindings: (c) => ({
      res: {
        status: c.res.status
      }
    })
  }
})
