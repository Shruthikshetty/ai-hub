/**
 * contains all the constants used throughout screens
 */
import { Theme } from '@renderer/components/theme-context'
import {
  MessageSquare,
  Image,
  Lock,
  Zap,
  Shield,
  User,
  Package,
  Palette,
  Settings,
  Sun,
  Moon,
  Monitor,
  LucideIcon
} from 'lucide-react'

// side tray items (do not change order add new items at the end)
export const SIDE_TRAY_ITEMS = [
  {
    name: 'Chat',
    path: '/chat',
    icon: MessageSquare
  },
  {
    name: 'Image',
    path: '/image',
    icon: Image
  }
] as const

export const SETTINGS_TRAY_ITEM = {
  name: 'Settings',
  path: '/settings',
  icon: Settings
} as const

export const QUICK_ACCESS_CARDS = [
  {
    name: 'AI Chat',
    path: SIDE_TRAY_ITEMS[0].path,
    message:
      'Chat with multiple AI models. Switch providers instantly and maintain conversation context across different models.',
    icon: MessageSquare
  },
  {
    name: 'Image',
    path: SIDE_TRAY_ITEMS[1].path,
    message:
      'Generate stunning images using local models. View your generation history and refine results instantly.',
    icon: Image
  }
] as const

export const HOME_INFO_CARD_ITEMS = [
  {
    title: '100% Local',
    message: 'Run AI models completely locally. Your data never leaves your machine.',
    icon: Lock
  },
  {
    title: 'Multi-Provider',
    message: 'Switch between different AI providers and models on the fly without hassle.',
    icon: Zap
  },
  {
    title: 'For Enthusiasts',
    message: 'Built by AI enthusiasts for AI enthusiasts. Full control and flexibility.',
    icon: MessageSquare
  }
] as const

export const QUICK_PROMPTS = [
  'Explain in simple terms',
  'Write code snippet',
  'Analyze this',
  'Brainstorm ideas'
]

export const SETTINGS_TABS = [
  {
    name: 'Profile',
    icon: User
  },
  {
    name: 'Providers',
    icon: Package
  },
  {
    name: 'Appearance',
    icon: Palette
  },
  {
    name: 'Security',
    icon: Shield
  }
] as const

export const SPINNER_COLORS = [
  '#fb7185', // rose-400
  '#f43f5e', // rose-500
  '#e11d48', // rose-600
  '#db2777', // pink-600
  '#c026d3', // fuchsia-600
  '#9333ea', // purple-600
  '#7c3aed', // violet-600
  '#6d28d9', // violet-700
  '#4f46e5', // indigo-600
  '#4338ca', // indigo-700
  '#3730a3', // indigo-800
  '#312e81' // indigo-900
]

export const THEME_OPTIONS: { value: Theme; label: string; icon?: LucideIcon }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor
  }
]
