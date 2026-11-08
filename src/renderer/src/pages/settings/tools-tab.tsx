import { Button } from '@renderer/components/ui/button'
import { useFetchMcpServers } from '@renderer/services/mcp'
import { Plus } from 'lucide-react'

/**
 * tools and Api's tab
 * contains options for connecting external mcp's , apis etc
 */
const ToolsTab = () => {
  const { data: mcpServersData } = useFetchMcpServers()
  // get list of mcp's
  return (
    <div className="h-full w-full px-[5%] py-5 flex flex-col gap-5 overflow-auto">
      {/* title */}
      <h1 className="text-2xl font-semibold">Tools And Api&apos;s</h1>
      {/* sections @NOTE current;y we only have mcp section added */}
      {/* MCP section */}
      <div className="flex flex-row justify-between gap-5 items-center">
        <div>
          <h2 className="text-lg font-semibold">MCP Servers</h2>
          <p className="text-base text-muted-foreground">
            Connect Model Context Protocol servers to give your assistant extra tools.
          </p>
        </div>
        {/*  Add new button  */}
        <Button
          type="button"
          variant="default"
          className="active:scale-95 sm:min-w-20 hover:bg-success! transition-colors"
          onClick={() => {}}
        >
          <Plus /> Add Server
        </Button>
      </div>
      {/*  list of all mcp */}
      <div>
        {mcpServersData?.data && mcpServersData?.data?.length > 0 ? (
          mcpServersData?.data.map((mcp) => (
            <div key={mcp.name}>
              <p>{mcp.name}</p>
              <p>{mcp.type}</p>
            </div>
          ))
        ) : (
          <p>no servers</p>
        )}
      </div>
    </div>
  )
}

export default ToolsTab
