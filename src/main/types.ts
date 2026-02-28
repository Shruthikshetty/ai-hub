import { OpenAPIHono, RouteHandler, RouteConfig } from '@hono/zod-openapi'

export interface AppBindings {
  Variables: {
    // placeholder for now
    x: string
  }
}

export type AppOpenApi = OpenAPIHono<AppBindings>

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T, AppBindings>
