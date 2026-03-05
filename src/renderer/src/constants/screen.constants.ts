/**
 * contains all the constants used throughout screens
 */
import {
  MessageSquare,
  Image,
  Lock,
  Zap,
  Shield,
  User,
  Package,
  Palette,
  Settings
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
