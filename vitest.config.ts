import { resolve } from 'node:path'

export default {
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer/src'),
      '@common': resolve(__dirname, 'src/common')
    }
  }
}
