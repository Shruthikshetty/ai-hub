import { Bot } from 'grammy'
import db from '../db'
import { connectors } from '../db/schema'
import { eq } from 'drizzle-orm'
import { decryptText } from '../../common/utils/encryption.util'

/**
 * This is the main telegram service that handles the connection and chat with telegram bot
 * we use grammy
 * this also handles the message splitting for any response that exceeds 4,000 char's
 * ref
 * - https://grammy.dev/guide/getting-started
 * - https://grammy.dev/guide/deployment-types#long-polling
 * - https://core.telegram.org/bots/api
 */
class TelegramBotService {
  //bot instance
  private bot: Bot | null = null

  /**
   * check if bot is running
   */
  public isRunning(): boolean {
    return this.bot !== null
  }

  /**
   * start telegram bot long polling
   */
  public async start(): Promise<{ botUsername: string }> {
    // check if already running
    if (this.bot) {
      const botInfo = await this.bot.api.getMe()
      return {
        botUsername: botInfo.username
      }
    }

    // if not running get the connector data
    const connector = await db.query.connectors.findFirst({
      where: eq(connectors.name, 'telegram')
    })

    // in case bot not found
    if (!connector || !connector.botToken) {
      throw new Error('Telegram bot token not found')
    }

    // decrypt the connector data
    const token = decryptText(connector.botToken)

    // create a new bot
    const newBot = new Bot(token)
    const newBotInfo = await newBot.api.getMe()

    // attach listeners
    newBot.command('start', (ctx) => ctx.reply('Hello from AI Hub!'))
    newBot.on('message:text', (ctx) => {
      ctx.reply(`Echo: ${ctx.message.text}`)
    })

    // Start long-polling
    newBot.start()

    // store teh created bot
    this.bot = newBot

    return { botUsername: newBotInfo.username }
  }

  /**
   * Stop bot polling
   */
  public async stop(): Promise<void> {
    const bot = this.bot
    if (bot) {
      await bot.stop()
      this.bot = null
      console.log(`[TelegramBot] Bot stopped.`)
    }
  }
}

export const telegramBotService = new TelegramBotService()
