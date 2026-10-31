import { telegramBotService } from '../services/telegram-bot.service'

// Map of all connector services
export const CONNECTOR_SERVICES: Record<string, { isRunning: () => boolean }> = {
  telegram: telegramBotService
}
