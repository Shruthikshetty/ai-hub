import { Composer, Context } from 'grammy'
import {
  getInfoConnectorByName,
  setNewConversationByConnectorName,
  splitMessage,
  truncateText
} from '../../lib/connector-utils'

// constants --------------

// list of all commands
export const TELEGRAM_BOT_COMMAND_MENU = [
  { command: 'start', description: 'welcome message' },
  { command: 'help', description: 'Show available commands' },
  { command: 'bot_info', description: 'Show model, provider & token stats' },
  { command: 'new_chat', description: 'start a fresh chat, by forgetting past messages' }
]

const TOOL_ICONS: Record<string, string> = {
  search: '🔍',
  profile: '👤',
  img_gen: '🎨'
}

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

// create a composer instance
export const telegramCommands = new Composer()

// utils --------

// strip html tags
export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function replyHtml(ctx: Context, text: string) {
  try {
    await ctx.reply(text, { parse_mode: 'HTML' })
  } catch (err) {
    console.warn(
      '[Telegram] replyHtml failed with parse_mode: HTML. Falling back to plain text. Error:',
      err
    )
    for (const chunk of splitMessage(text)) {
      try {
        await ctx.reply(chunk)
      } catch (fallbackErr) {
        console.warn('[Telegram] replyHtml fallback plain text failed:', fallbackErr)
      }
    }
  }
}

export async function replyMarkdown(ctx: Context, text: string) {
  try {
    await ctx.reply(text, { parse_mode: 'Markdown' })
  } catch (err) {
    console.warn(
      '[Telegram] replyMarkdown failed with parse_mode: Markdown. Falling back to plain text. Error:',
      err
    )
    for (const chunk of splitMessage(text)) {
      try {
        await ctx.reply(chunk)
      } catch (fallbackErr) {
        console.warn('[Telegram] replyMarkdown fallback plain text failed:', fallbackErr)
      }
    }
  }
}

// tool call ui for telegram collapsible block
export function formatTelegramToolBlock(toolName: string, input: unknown): string {
  const icon = TOOL_ICONS?.[toolName] || '🛠️'

  let details = ''
  // handle known cases else fallback to raw input
  if (typeof input === 'object' && input !== null) {
    const record = input as Record<string, unknown>
    if ('query' in record && typeof record.query === 'string') {
      details = `\n<b>Query:</b> <code>${escapeHtml(truncateText(record.query))}</code>`
    } else if ('prompt' in record && typeof record.prompt === 'string') {
      details = `\n<b>Prompt:</b> <code>${escapeHtml(truncateText(record.prompt))}</code>`
    } else if (Object.keys(record).length > 0) {
      details = `\n<code>${escapeHtml(truncateText(JSON.stringify(record)))}</code>`
    }
  } else if (input) {
    details = `\n<code>${escapeHtml(truncateText(String(input)))}</code>`
  }

  return `<blockquote expandable>${icon} <b>Tool Called:</b> ${escapeHtml(toolName)} : ${details}</blockquote>`
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
