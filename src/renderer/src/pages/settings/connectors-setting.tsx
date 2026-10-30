import { AVAILABLE_CONNECTORS } from '@common/constants/global.constants'
import ConnectorCard from '@renderer/components/connector-card'
import { useFetchConnectors } from '@renderer/services/connectors'
import { useMemo } from 'react'
/**
 * renders the connectors setting tab
 * here can connect to external services like telegram
 */
function ConnectorSettings() {
  // fetch list of added connected connectors
  const { data: connectorsData } = useFetchConnectors()

  // connectors that can be added
  const availableToAdd = useMemo(() => {
    const addedNames = new Set(connectorsData?.data?.map((c) => c.name) ?? [])
    return AVAILABLE_CONNECTORS.filter((item) => !addedNames.has(item.name)) ?? []
  }, [connectorsData])

  return (
    <div className="h-full w-full px-[5%] py-5 flex flex-col gap-5">
      {/* title description  */}
      <div>
        <h1 className="text-2xl font-semibold">Connectors</h1>
        <p className="text-lg">Link external platforms so people can talk to your assistant.</p>
      </div>
      {/* list of configured providers */}
      {connectorsData?.data.map((item) => (
        <ConnectorCard key={item.name} connector={item} type="UPDATE" />
      ))}
      {/* list of connectors available to add */}
      {availableToAdd.map((item) => (
        <ConnectorCard key={item.name} connector={item} type="ADD" />
      ))}
    </div>
  )
}

export default ConnectorSettings
