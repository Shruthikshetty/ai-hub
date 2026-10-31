/**
 * This file contain all the connectors related services
 */

import { ConnectorCreateSchema, ConnectorUpdateSchema } from '@common/db-schemas/connector.schema'
import {
  DeleteConnectorResponseSchemaType,
  FetchAllConnectorResponseSchemaType,
  StartConnectorResponseSchemaType,
  StopConnectorResponseSchemaType,
  UpdateConnectorResponseSchemaType
} from '@common/schemas/connector.schema'
import { ApiError } from '@common/types'
import { FETCH_CONNECTORS_STALE_TIME } from '@renderer/constants/config.constants'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast, successToast } from '@renderer/lib/toast-wrapper'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * hook to fetch all connectors
 */
export const useFetchConnectors = () => {
  return useQuery<FetchAllConnectorResponseSchemaType, ApiError>({
    queryKey: [QUERY_KEYS.connectorsFetch],
    queryFn: async () => {
      const response = await window.api.request('/api/connector', 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    staleTime: FETCH_CONNECTORS_STALE_TIME
  })
}

/**
 * hook to add a connector
 */
export const useAddConnector = () => {
  const queryClient = useQueryClient()

  return useMutation<UpdateConnectorResponseSchemaType, ApiError, ConnectorCreateSchema>({
    mutationKey: [MUTATION_KEYS.addConnector],
    mutationFn: async (connector) => {
      const response = await window.api.request(`/api/connector`, 'POST', connector)
      if (!response.success) {
        throw response
      }
      return response.data
    },
    onSuccess: () => {
      successToast('connector added successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.connectorsFetch] })
    }
  })
}

/**
 * hook to update a connector
 */
export const useUpdateConnector = () => {
  const queryClient = useQueryClient()

  return useMutation<
    UpdateConnectorResponseSchemaType,
    ApiError,
    { connector: ConnectorUpdateSchema; name: string }
  >({
    mutationKey: [MUTATION_KEYS.updateConnectorByName],
    mutationFn: async ({ connector, name }) => {
      const response = await window.api.request(`/api/connector/${name}`, 'PATCH', connector)
      if (!response.success) {
        throw response
      }
      return response.data
    },
    onSuccess: (data) => {
      successToast(`${data?.data?.displayName ?? ''} connector updated successfully`)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.connectorsFetch] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to update connector')
    }
  })
}

/**
 * hook to delete a connector
 */
export const useDeleteConnector = () => {
  const queryClient = useQueryClient()

  return useMutation<DeleteConnectorResponseSchemaType, ApiError, string>({
    mutationKey: [MUTATION_KEYS.deleteConnectorByName],
    mutationFn: async (name) => {
      const response = await window.api.request(`/api/connector/${name}`, 'DELETE')
      if (!response.success) {
        throw response
      }
      return response.data
    },
    onSuccess: () => {
      successToast('Connector deleted successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.connectorsFetch] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to delete connector')
    }
  })
}

/**
 * hook to start a connector by name
 */
export const useStartConnector = () => {
  const queryClient = useQueryClient()
  return useMutation<StartConnectorResponseSchemaType, ApiError, string>({
    mutationKey: [MUTATION_KEYS.startConnectorByName],
    mutationFn: async (name) => {
      const response = await window.api.request(`/api/connector/${name}/start`, 'POST')
      if (!response.success) {
        throw response
      }
      return response.data
    },
    onSuccess: (data) => {
      successToast(
        data?.data?.botUsername
          ? `Connected to @${data.data.botUsername}`
          : 'Connector started successfully'
      )
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.connectorsFetch] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to start connector')
    }
  })
}

/**
 * hook to stop a connector
 */
export const useStopConnector = () => {
  const queryClient = useQueryClient()

  return useMutation<StopConnectorResponseSchemaType, ApiError, string>({
    mutationKey: [MUTATION_KEYS.stopConnectorByName],
    mutationFn: async (name) => {
      const response = await window.api.request(`/api/connector/${name}/stop`, 'POST')
      if (!response.success) {
        throw response
      }
      return response.data
    },
    onSuccess: (data) => {
      successToast(data?.message ?? 'Connector stopped successfully')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.connectorsFetch] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to stop connector')
    }
  })
}
