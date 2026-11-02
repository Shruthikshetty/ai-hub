import { Composer, Context } from 'grammy'
import { getInfoConnectorByName } from '../../lib/connector-utils'

// create a composer instance
export const telegramCommands = new Composer()

// list of all commands
export const TELEGRAM_BOT_COMMAND_MENU = [
  { command: 'start', description: 'welcome message' },
  { command: 'help', description: 'Show available commands' },
  { command: 'bot_info', description: 'Show model, provider & token stats' }
]

// constants
const helpMessage = [
  `👋 *Welcome to AI Hub telegram Bot!*`,
  ``,
  `Available Commands:`,
  TELEGRAM_BOT_COMMAND_MENU.map((c) => `\`/${c.command}\` - ${c.description}`).join('\n'),
  ``,
  `💡 *Tip:* Send any text message to talk to the AI. Wait for a reply before sending another message.`
].join('\n')

// utils
async function replyMarkdown(ctx: Context, text: string) {
  try {
    await ctx.reply(text, { parse_mode: 'Markdown' })
  } catch {
    await ctx.reply(text)
  }
}

// all the comments handlers go here

telegramCommands.command('help', async (ctx) => {
  replyMarkdown(ctx, helpMessage)
})

telegramCommands.command('start', async (ctx) =>
  ctx.reply(
    'Hello from AI Hub! \nIts recommended to wait for the reply before sending another request , the bot might not remember your previous request'
  )
)

telegramCommands.command(['bot-info', 'botinfo'], async (ctx) => {
  const info = await getInfoConnectorByName('telegram')
  replyMarkdown(ctx, info)
})
