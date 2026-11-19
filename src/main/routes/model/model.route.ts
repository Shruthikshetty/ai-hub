/**
 * @file contains all the routes related to models with Zod Open Api support
 */
import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  badRequestDocObject,
  internalServerErrorDocObject,
  zodNotFoundDocObject
} from '../../constants/doc-constants'
import {
  modelAddResponse,
  modelDeleteResponse,
  modelUpdateResponse,
  ModelIOSchema,
  modelResponseSchema,
  modelResponseSchemaV2
} from '../../../common/schemas/model.schema'
import {
  modalitySchema,
  modelsInsertSchema,
  modelsPatchSchema
} from '../../../common/db-schemas/model.schema'

/* route to get all the list of models available
 * @deprecated used v2
 */
export const getModels = createRoute({
  method: 'get',
  path: '/model',
  tags: ['Model'],
  summary: 'Get all the list of models available',
  deprecated: true,
  request: {
    query: z.object({
      output: ModelIOSchema.optional()
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: modelResponseSchema
        }
      },
      description: 'Success response of get all models'
    },
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to get all models available from local database (v2)
export const getModelsV2 = createRoute({
  method: 'get',
  path: '/v2/model',
  tags: ['Model'],
  summary: 'Get all models available from local database',
  request: {
    query: z.object({
      output: modalitySchema.optional(),
      providerId: z.string().optional()
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: modelResponseSchemaV2
        }
      },
      description: 'Success response of get all models'
    },
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to add a new custom model
export const addModel = createRoute({
  method: 'post',
  path: '/model',
  tags: ['Model'],
  summary: 'Add a custom model to the list of models',
  request: {
    body: {
      content: {
        'application/json': {
          schema: modelsInsertSchema
        }
      },
      required: true
    }
  },
  responses: {
    [HTTP_STATUS_CODES.CREATED]: {
      content: {
        'application/json': {
          schema: modelAddResponse
        }
      },
      description: 'Success response for adding a model'
    },
    [HTTP_STATUS_CODES.BAD_REQUEST]: badRequestDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to delete a model by providerId and id
export const deleteModel = createRoute({
  method: 'delete',
  path: '/model/{providerId}/{id}',
  tags: ['Model'],
  summary: 'Delete a model by provider ID and model ID',
  request: {
    params: z.object({
      providerId: z.string().openapi({
        param: {
          name: 'providerId',
          in: 'path',
          required: true,
          description: 'Provider ID of the model'
        },
        example: 'openai'
      }),
      id: z.string().openapi({
        param: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Model ID'
        },
        example: 'gpt-4o'
      })
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: modelDeleteResponse
        }
      },
      description: 'Success response for deleting a model'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to update a model by providerId and id
export const updateModel = createRoute({
  method: 'patch',
  path: '/model/{providerId}/{id}',
  tags: ['Model'],
  summary: 'Update a model by provider ID and model ID',
  request: {
    params: z.object({
      providerId: z.string().openapi({
        param: {
          name: 'providerId',
          in: 'path',
          required: true,
          description: 'Provider ID of the model'
        },
        example: 'openai'
      }),
      id: z.string().openapi({
        param: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Model ID'
        },
        example: 'gpt-4o'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: modelsPatchSchema
        }
      },
      required: true
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: modelUpdateResponse
        }
      },
      description: 'Success response for updating a model'
    },
    [HTTP_STATUS_CODES.BAD_REQUEST]: badRequestDocObject,
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all the types
export type GetModelsRoute = typeof getModels
export type GetModelsV2Route = typeof getModelsV2
export type AddModelRoute = typeof addModel
export type DeleteModelRoute = typeof deleteModel
export type UpdateModelRoute = typeof updateModel
