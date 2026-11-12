import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: [
          '@ai-sdk/alibaba',
          '@ai-sdk/anthropic',
          '@ai-sdk/cerebras',
          '@ai-sdk/cohere',
          '@ai-sdk/elevenlabs',
          '@ai-sdk/fireworks',
          '@ai-sdk/google',
          '@ai-sdk/groq',
          '@ai-sdk/huggingface',
          '@ai-sdk/mistral',
          '@ai-sdk/openai',
          '@ai-sdk/openai-compatible',
          '@ai-sdk/togetherai',
          '@ai-sdk/xai',
          'ai',
          '@openrouter/ai-sdk-provider',
          'ollama-ai-provider-v2'
        ]
      },
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
          worker: resolve(__dirname, 'src/main/worker.ts') // worker entry
        }
      }
    }
  },
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@common': resolve(__dirname, 'src/common') // Shared alias
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      Pages({
        dirs: [{ dir: resolve(__dirname, 'src/renderer/src/pages'), baseRoute: '' }],
        extensions: ['tsx']
      })
    ]
  }
})
