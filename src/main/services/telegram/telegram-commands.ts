import { Composer, Context } from 'grammy'
import {
  getInfoConnectorByName,
  setNewConversationByConnectorName
} from '../../lib/connector-utils'

// create a composer instance
export const telegramCommands = new Composer()

// list of all commands
export const TELEGRAM_BOT_COMMAND_MENU = [
  { command: 'start', description: 'welcome message' },
  { command: 'help', description: 'Show available commands' },
  { command: 'bot_info', description: 'Show model, provider & token stats' },
  { command: 'new_chat', description: 'start a fresh chat, by forgetting past messages' }
]

// constants
const helpMessage = [
  `*🤖 Welcome to AI Hub Telegram Bot!*`,
  `_Your personal AI assistant right inside Telegram._`,
  ``,
  `*📋 Available Commands:*`,
  ...TELEGRAM_BOT_COMMAND_MENU.map((c) => `• \`/${c.command}\` — _${c.description}_`),
  ``,
  `💡 *Tip:* _Send any regular text message to talk to the AI._`,
  `⚠️ *Note:* _Please wait for a reply before sending another message._`
].join('\n')

// utils
export async function replyMarkdown(ctx: Context, text: string) {
  try {
    await ctx.reply(text, { parse_mode: 'Markdown' })
  } catch (err) {
    console.warn(
      '[Telegram] replyMarkdown failed with parse_mode: Markdown. Falling back to plain text. Error:',
      err
    )
    await ctx.reply(text)
  }
}

// all the comments handlers go here

telegramCommands.command('help', async (ctx) => {
  await replyMarkdown(ctx, helpMessage)
})

telegramCommands.command('start', async (ctx) => {
  await replyMarkdown(
    ctx,
    [
      `*👋 Hello from AI Hub!*`,
      ``,
      `Send any message to start chatting with the AI.`,
      ``,
      `💡 *Note:* _Please wait for a reply before sending another message to keep conversation context._`
    ].join('\n')
  )
})

telegramCommands.command(['bot_info', 'botinfo'], async (ctx) => {
  const info = await getInfoConnectorByName('telegram')
  await replyMarkdown(ctx, info)
})

telegramCommands.command(['new_chat', 'new', 'newchat'], async (ctx) => {
  const message = await setNewConversationByConnectorName('telegram')
  await replyMarkdown(ctx, message)
})
