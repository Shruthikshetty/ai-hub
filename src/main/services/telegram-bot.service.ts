import { Bot } from 'grammy'
import db from '../db'
import { connectors } from '../db/schema'
import { eq } from 'drizzle-orm'
import { decryptText } from '../../common/utils/encryption.util'
import { getConnectorChatContext, getAiResponseForBotNonStream } from '../lib/connector-utils'

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
  private startPromise: Promise<{ botUsername: string }> | null = null // used to prevent duplicate bot starts

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
    // If a start is already in progress, reuse the same promise!
    if (this.startPromise) {
      return this.startPromise
    }

    // Create a promise that handles the bot startup
    this.startPromise = (async () => {
      try {
        // if not running get the connector data
        const connector = await db.query.connectors.findFirst({
          where: eq(connectors.name, 'telegram')
        })

        // in case bot not found
        if (!connector || !connector.botToken) {
          throw new Error('Telegram bot token not found')
        }
        // get the list of allowed users
        const allowedUsers = Array.isArray(connector.allowedUsers) ? connector.allowedUsers : []

        // in case allowed users not found
        if (allowedUsers.length === 0) {
          throw new Error('Telegram connector requires at least one allowed user id')
        }

        // decrypt the connector data
        const token = decryptText(connector.botToken)

        // create a new bot
        const newBot = new Bot(token)
        const newBotInfo = await newBot.api.getMe()

        // attach listeners
        newBot.command('start', (ctx) =>
          ctx.reply(
            'Hello from AI Hub! \nIts recommended to wait for the reply before sending another request , the bot might not remember your previous request'
          )
        )
        newBot.on('message:text', async (ctx) => {
          // only allow authorized users
          if (!allowedUsers.includes(String(ctx.from?.id))) {
            ctx.reply('⛔ Unauthorized please request access from the admin to use this bot')
            return
          }

          // new mess from the user
          const newPrompt =
            ctx.message?.text || 'reply to user that u did not receive any valid request'

          // get existing messages or create a new conversation
          const { conversationId, modelMessages, modelId, provider, systemPrompt } =
            await getConnectorChatContext({
              connectorName: 'telegram',
              newPrompt
            })

          // show typing in ui
          ctx.replyWithChatAction('typing').catch(() => {})

          // generate response based on the query provided
          const response = await getAiResponseForBotNonStream({
            modelId,
            provider,
            systemPrompt,
            messages: modelMessages,
            conversationId
          })

          // send response to user
          ctx.reply(response)
        })
        newBot.catch(async (err) => {
          console.error('[TelegramBot] Unhandled bot error:', err.error)
          // Inform the user in Telegram if possible and not a connection error
          try {
            await err.ctx.reply(
              '⚠️ Something went wrong while processing your request. Please try again later.'
            )
          } catch {
            // Silent fail if network is completely down or Telegram API is unreachable
          }
        })

        // Start long-polling
        newBot.start().catch((error) => {
          console.error('[TelegramBot] Polling stopped with error:', error)
          if (this.bot === newBot) {
            this.bot = null // reset is running state
          }
        })

        // store the created bot
        this.bot = newBot

        return { botUsername: newBotInfo.username }
      } finally {
        this.startPromise = null // Clear lock when done or on error
      }
    })()
    return this.startPromise
  }

  /**
   * Stop bot polling
   */
  public async stop(): Promise<void> {
    // if starting is in progress wait for it
    if (this.startPromise) {
      await this.startPromise.catch(() => {})
    }
    // get the bot instance
    const bot = this.bot
    // if bot exists stop the bot
    if (bot) {
      await bot.stop()
      this.bot = null
      console.log(`[TelegramBot] Bot stopped.`)
    }
  }

  /**
   * Restart bot polling
   */
  public async restart(): Promise<{ botUsername: string }> {
    await this.stop()
    return this.start()
  }
}

export const telegramBotService = new TelegramBotService()
