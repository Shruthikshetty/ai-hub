import { OpenAPIHono, RouteHandler, RouteConfig } from '@hono/zod-openapi'

export interface AppBindings {
  Variables: {
    // placeholder for now
    x: string
  }
}

export type AppOpenApi = OpenAPIHono<AppBindings>

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T, AppBindings>

// common type that a connector service will implement
export interface ConnectorService {
  isRunning: () => boolean
  restart: () => Promise<unknown>
  start?: () => Promise<unknown>
  stop?: () => Promise<void>
}
