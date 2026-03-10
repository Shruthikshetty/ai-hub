import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../components/ui/resizable'

export default function ChatPage() {
  return (
    <div className="h-full w-full bg-[#0a0a0a] text-white">
      <ResizablePanelGroup className="h-full w-full">
        {/* LEFT PANEL: HISTORY */}
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          maxSize={120}
          className="bg-[#171717] border-r border-white/10"
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex justify-between items-center mb-4 text-[10px] font-bold text-gray-500">
              HISTORY
            </div>
            {/* Your Chat History List */}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/5 hover:bg-white/10 transition-colors" />

        {/* MIDDLE PANEL: MAIN CHAT */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="flex h-full flex-col bg-[#0a0a0a]">
            <header className="h-14 border-b border-white/5 flex items-center px-4">
              <span className="text-xs text-gray-400">GPT-4o</span>
            </header>
            <main className="flex-1">{/* Chat Messages */}</main>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/5 hover:bg-white/10 transition-colors" />

        {/* RIGHT PANEL: OPTIONS */}
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          maxSize={30}
          className="bg-[#171717] border-l border-white/10"
        >
          <div className="p-4 h-full">
            <h2 className="text-[10px] font-bold text-gray-500 mb-6 tracking-widest uppercase">
              Context & Reference
            </h2>
            {/* Your Token Counter and Reasoning Dropdown */}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
