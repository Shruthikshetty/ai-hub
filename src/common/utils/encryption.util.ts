import crypto from 'node:crypto'
import env from '../../../env'
import { IV_LENGTH } from '../constants/global.constants'

// This takes a string of ANY length and turns it into a consistent 32-byte Buffer
// It guarantees the key length is exactly what aes-256 requires
const keyBuffer = crypto
  .createHash('sha256')
  .update(env.ENCRYPTION_KEY || '')
  .digest()

/**
 * Encrypts a plain text string
 * @param text The plain text to encrypt
 * @returns The encrypted string (format: iv:encryptedData)
 */
export function encryptText(text: string): string {
  if (!text) return text

  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv)

  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  // Return the IV and the encrypted data separated by a colon
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

/**
 * Decrypts an encrypted string
 * @param text The encrypted string (format: iv:encryptedData)
 * @returns The decrypted plain text string
 */
export function decryptText(text: string): string {
  if (!text) return text

  try {
    const textParts = text.split(':')
    const ivPart = textParts.shift()
    if (!ivPart) throw new Error('Invalid encryption format')

    const iv = Buffer.from(ivPart, 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv)

    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString()
  } catch (error) {
    console.error('Failed to decrypt text:', error)
    // If decryption fails (e.g., text wasn't encrypted), return the original text
    // This provides backward compatibility if the database currently has unencrypted keys
    return text
  }
}
