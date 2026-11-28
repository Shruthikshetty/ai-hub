import { telegramBotService } from '../services/telegram/telegram-bot.service'
import { ConnectorService } from '../types'

// Map of all connector services
export const CONNECTOR_SERVICES: Record<string, ConnectorService> = {
  telegram: telegramBotService
}

// remote model insert chunks
export const MODEL_INSERT_CHUNK_SIZE = 500

// model catalog url
export const REMOTE_MODEL_CATALOG_URL = 'https://models.superapps.host/catalog.json'
export const REMOTE_MODEL_CATALOG_TIMEOUT = 10000 // 10 seconds
