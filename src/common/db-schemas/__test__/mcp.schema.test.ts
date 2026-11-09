import { describe, expect, it } from 'vitest'
import { mcpServerUpdateSchema } from '../mcp.schema'

describe('mcpServerUpdateSchema', () => {
  it('should not inject default args when args is omitted', () => {
    const result = mcpServerUpdateSchema.parse({ enabled: false })
    expect(result).toEqual({ enabled: false })
    expect(result).not.toHaveProperty('args')
  })

  it('should preserve args when explicitly provided', () => {
    const result = mcpServerUpdateSchema.parse({ args: ['--port', '8080'] })
    expect(result).toEqual({ args: ['--port', '8080'] })
  })

  it('should allow updating both enabled and name without args', () => {
    const result = mcpServerUpdateSchema.parse({ name: 'my-server', enabled: true })
    expect(result).toEqual({ name: 'my-server', enabled: true })
    expect(result).not.toHaveProperty('args')
  })

  it('should reject an empty body', () => {
    expect(() => mcpServerUpdateSchema.parse({})).toThrow(/At least one field must be provided/)
  })
})
