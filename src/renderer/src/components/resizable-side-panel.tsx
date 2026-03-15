import { PanelImperativeHandle, PanelProps } from 'react-resizable-panels'
import { ResizablePanel } from './ui/resizable'
import React, { useEffect, useRef } from 'react'
import { cn } from '@renderer/lib/utils'

/**
 * This is a wrapper for ResizablePanel that snaps open and close based on the isOpen prop
 * also snaps to close when the minSize is reached
 * make sure to use within ResizablePanelGroup or it will not work
 */
export default function ResizableSidePanel({
  isOpen,
  setIsOpen,
  children,
  classNames = { container: '', panel: '' },
  defaultSize = '20%',
  minSize = 0,
  maxSize = '33%',
  collapsedSize = 0,
  ...panelProps
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: React.ReactNode
  classNames?: { container?: string; panel?: string }
  defaultSize?: number | string
  minSize?: number | string
  maxSize?: number | string
  collapsedSize?: number | string
} & Omit<PanelProps, 'children' | 'defaultSize' | 'minSize' | 'maxSize' | 'collapsedSize'>) {
  // store the panel ref
  const panelRef = useRef<PanelImperativeHandle>(null)
  // handel the toggle state to sync with open close of the external state
  useEffect(() => {
    if (isOpen) {
      panelRef.current?.expand()
    } else {
      panelRef.current?.collapse()
    }
  }, [isOpen])

  return (
    <ResizablePanel
      panelRef={panelRef}
      collapsible={true}
      collapsedSize={collapsedSize}
      onResize={() => {
        if (panelRef.current?.isCollapsed()) {
          setIsOpen(false)
        } else {
          setIsOpen(true)
        }
      }}
      className={cn('bg-sidebar border-white/10 transition-all', classNames.panel)}
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      {...panelProps}
    >
      <div
        className={cn(
          'transition-opacity duration-200 h-full flex flex-col',
          !isOpen ? 'opacity-0 overflow-hidden' : 'opacity-100',
          classNames.container
        )}
      >
        {children}
      </div>
    </ResizablePanel>
  )
}
