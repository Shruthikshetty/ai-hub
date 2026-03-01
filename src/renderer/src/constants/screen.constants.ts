/**
 * contains all the constants used throwout screens
 */
import { MessageSquare, Image, Lock, Zap } from 'lucide-react'

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

export const QUICK_ACCESS_CARDS = [
  {
    name: 'AI Chat',
    path: '/chat',
    message:
      'Chat with multiple AI models. Switch providers instantly and maintain conversation context across different models.',
    icon: MessageSquare
  },
  {
    name: 'Image',
    path: '/image',
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
