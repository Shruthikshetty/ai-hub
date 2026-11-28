import { ModelGetSchema } from '@common/db-schemas/model.schema'
import { Brain, Eye, FileText, Globe, LucideIcon, Radio, Video, Wrench } from 'lucide-react'

export type ModelBadgeItem = {
  label: string
  icon?: LucideIcon
  className?: string
}

/**
 * Builds the ordered list of output and capability badges for a model.
 */
export function getModelBadges(model: ModelGetSchema): ModelBadgeItem[] {
  const caps = model.capabilities
  const list: ModelBadgeItem[] = model.outputs.map((output) => ({
    label: `${output} output`,
    className: 'capitalize bg-secondary text-secondary-foreground border-transparent'
  }))

  const capabilityRules: [boolean | undefined, ModelBadgeItem][] = [
    [
      caps.vision,
      {
        label: 'Vision',
        icon: Eye,
        className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
      }
    ],
    [
      caps.reasoning?.supported,
      {
        label: 'Reasoning',
        icon: Brain,
        className: 'bg-purple-500/15 text-purple-400 border-purple-500/25'
      }
    ],
    [
      caps.functionCalling,
      {
        label: 'Tools',
        icon: Wrench,
        className: 'bg-blue-500/15 text-blue-400 border-blue-500/25'
      }
    ],
    [
      caps.webSearch,
      {
        label: 'Search',
        icon: Globe,
        className: 'bg-teal-500/15 text-teal-400 border-teal-500/25'
      }
    ],
    [
      caps.fileInput,
      {
        label: 'Files',
        icon: FileText,
        className: 'bg-sky-500/15 text-sky-400 border-sky-500/25'
      }
    ],
    [
      caps.realtime,
      {
        label: 'Realtime',
        icon: Radio,
        className: 'bg-rose-500/15 text-rose-400 border-rose-500/25'
      }
    ],
    [
      caps.videoReasoning,
      {
        label: 'Video',
        icon: Video,
        className: 'bg-pink-500/15 text-pink-400 border-pink-500/25'
      }
    ]
  ]

  for (const [enabled, badge] of capabilityRules) {
    if (enabled) list.push(badge)
  }

  return list
}
