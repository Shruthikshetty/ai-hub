import { telegramBotService } from '../services/telegram-bot.service'
import { ConnectorService } from '../types'

// Map of all connector services
export const CONNECTOR_SERVICES: Record<string, ConnectorService> = {
  telegram: telegramBotService
}
