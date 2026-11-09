import { McpCard } from '@renderer/components/mcp-card'
import { Button } from '@renderer/components/ui/button'
import { useFetchMcpServers } from '@renderer/services/mcp'
import { Plus } from 'lucide-react'
import { useState } from 'react'

/**
 * tools and Api's tab
 * contains options for connecting external mcp's , apis etc
 */
const ToolsTab = () => {
  // state to store mcp Adding state
  const [isMcpAdding, setIsMcpAdding] = useState(false)
  //hook to fetch mcps
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
          onClick={() => {
            setIsMcpAdding(true)
          }}
        >
          <Plus /> Add Server
        </Button>
      </div>
      {isMcpAdding ? <McpCard mode={'ADD'} onClose={() => setIsMcpAdding(false)} /> : null}
      <div className="gap-5 flex flex-col">
        {/*  list of all mcp */}
        {mcpServersData?.data && mcpServersData?.data?.length > 0
          ? mcpServersData?.data.map((mcp) => <McpCard mode={'UPDATE'} key={mcp.name} data={mcp} />)
          : null}
        {/*  empty place holder */}
        {!(mcpServersData?.data && mcpServersData?.data?.length > 0) && !isMcpAdding ? (
          <EmptyPlaceHolder text="No MCP servers added yet." />
        ) : null}
      </div>
    </div>
  )
}

// sub components

// empty place holder
const EmptyPlaceHolder = ({ text }: { text: string }) => {
  return (
    <div className="text-center border-2 border-border rounded-xl p-4 border-dashed">
      <p className="text-muted-foreground">{text}</p>
    </div>
  )
}

export default ToolsTab
