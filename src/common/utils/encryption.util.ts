import crypto from 'node:crypto'
import env from '../../../env'
import { IV_LENGTH } from '../constants/global.constants'

// This takes a string of ANY length and turns it into a consistent 32-byte Buffer
// It guarantees the key length is exactly what aes-256 requires
const keyBuffer = crypto.createHash('sha256').update(env.ENCRYPTION_KEY).digest()

/**
 * Encrypts a plain text string
 * @param text The plain text to encrypt
 * @returns The encrypted string (format: iv:encryptedData)
 */
export function encryptText(text: string): string {
  if (!text) return text

  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv)

  let encrypted = cipher.update(text, 'utf8')
  encrypted = Buffer.concat([encrypted, cipher.final()])
  const authTag = cipher.getAuthTag()

  // Return the IV, the encrypted data, and the auth tag separated by a colon
  return iv.toString('hex') + ':' + encrypted.toString('hex') + ':' + authTag.toString('hex')
}

/**
 * Decrypts an encrypted string
 * @param text The encrypted string (format: iv:encryptedData:authTag)
 * @returns The decrypted plain text string
 */
export function decryptText(text: string): string {
  if (!text) return text

  try {
    const textParts = text.split(':')
    if (textParts.length < 3) throw new Error('Invalid encryption format')

    const iv = Buffer.from(textParts[0], 'hex')
    const encryptedText = Buffer.from(textParts[1], 'hex')
    const authTag = Buffer.from(textParts[2], 'hex')

    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString('utf8')
  } catch (error) {
    console.error('Failed to decrypt text:', error)
    // If decryption fails (e.g., text wasn't encrypted), return the original text
    // This provides backward compatibility if the database currently has unencrypted keys
    return text
  }
}
