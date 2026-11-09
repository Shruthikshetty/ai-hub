/**
 * This file contains all the MCP related services
 */

import { McpInsertSchema, McpUpdateSchema } from '@common/db-schemas/mcp.schema'
import {
  CreateMcpServerResponseSchemaType,
  DeleteMcpServerResponseSchemaType,
  FetchAllMcpServersResponseSchemaType,
  TestMcpServerRequestSchemaType,
  TestMcpServerResponseSchemaType,
  UpdateMcpServerResponseSchemaType
} from '@common/schemas/mcp.schema'
import { ApiError } from '@common/types'
import { FETCH_MCP_SERVERS_STALE_TIME } from '@renderer/constants/config.constants'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast, successToast } from '@renderer/lib/toast-wrapper'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * hook to fetch all MCP servers
 */
export const useFetchMcpServers = () => {
  return useQuery<FetchAllMcpServersResponseSchemaType, ApiError>({
    queryKey: [QUERY_KEYS.mcpServersFetch],
    queryFn: async () => {
      const response = await window.api.request('/api/mcp', 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    staleTime: FETCH_MCP_SERVERS_STALE_TIME
  })
}

/**
 * hook to add an MCP server
 */
export const useAddMcpServer = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateMcpServerResponseSchemaType, ApiError, McpInsertSchema>({
    mutationKey: [MUTATION_KEYS.addMcpServer],
    mutationFn: async (mcpServer) => {
      const response = await window.api.request('/api/mcp', 'POST', mcpServer)
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      successToast('MCP server added successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.mcpServersFetch] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to add MCP server')
    }
  })
}

/**
 * hook to update an MCP server
 */
export const useUpdateMcpServer = () => {
  const queryClient = useQueryClient()

  return useMutation<
    UpdateMcpServerResponseSchemaType,
    ApiError,
    { mcpServer: McpUpdateSchema; id: string }
  >({
    mutationKey: [MUTATION_KEYS.updateMcpServerById],
    mutationFn: async ({ mcpServer, id }) => {
      const response = await window.api.request(`/api/mcp/${id}`, 'PATCH', mcpServer)
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: (data) => {
      successToast(
        data?.data?.name
          ? `${data.data.name} updated successfully`
          : 'MCP server updated successfully'
      )
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.mcpServersFetch] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to update MCP server')
    }
  })
}

/**
 * hook to delete an MCP server
 */
export const useDeleteMcpServer = () => {
  const queryClient = useQueryClient()

  return useMutation<DeleteMcpServerResponseSchemaType, ApiError, string>({
    mutationKey: [MUTATION_KEYS.deleteMcpServerById],
    mutationFn: async (id) => {
      const response = await window.api.request(`/api/mcp/${id}`, 'DELETE')
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      successToast('MCP server deleted successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.mcpServersFetch] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to delete MCP server')
    }
  })
}

/**
 * hook to test an MCP server connection
 */
export const useTestMcpServer = () => {
  return useMutation<TestMcpServerResponseSchemaType, ApiError, TestMcpServerRequestSchemaType>({
    mutationKey: [MUTATION_KEYS.testMcpServer],
    mutationFn: async (testParams) => {
      const response = await window.api.request('/api/mcp/test', 'POST', testParams)
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: (data) => {
      successToast(data?.message ?? 'Mcp connection tested successfully')
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to connect to MCP server')
    }
  })
}
