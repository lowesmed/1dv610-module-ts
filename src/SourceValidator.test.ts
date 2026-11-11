import { describe, it, expect } from 'vitest'
import { validateImageFormat, isUrl } from './SourceValidator.js'

describe('validateImageFormat()', () => {
  it('accepts .jpg and .jpeg files and URLs with a query string', () => {
    expect(() => validateImageFormat('cat.jpg')).not.toThrow()
    expect(() => validateImageFormat('cat.JPEG')).not.toThrow()
    expect(() => validateImageFormat('https://example.com/cat.jpg?w=100')).not.toThrow()
  })

  it('rejects other formats and names that ends with the letters jpg', () => {
    expect(() => validateImageFormat('cat.png')).toThrow('The image must be in jpg/jpeg format')
    expect(() => validateImageFormat('notajpg')).toThrow('The image must be in jpg/jpeg format')
  })
})

describe('isUrl()', () => {
  it('returns true for http and https URLs', () => {
    expect(isUrl('http://example.com/cat.jpg')).toBe(true)
    expect(isUrl('https://example.com/cat.jpg')).toBe(true)
  })

  it('returns false for other protocols and file paths', () => {
    expect(isUrl('./cat.jpg')).toBe(false)
    expect(isUrl('ftp://http/images/cat.jpg')).toBe(false)
  })
})
