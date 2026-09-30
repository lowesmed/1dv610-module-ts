import { describe, it, expect } from 'vitest'
import { OptiPic } from './index.js'

describe('OptiPic', () => {
  it('Reads metadata from a JPEG URL', async () => {
    const image = new OptiPic()

    await image.load('https://images.pexels.com/photos/33582812/pexels-photo-33582812.jpeg')

    const metadata = image.getMetadata()

    expect(metadata.format).toBe('jpeg')
    expect(metadata.width).toBe(2887)
    expect(metadata.height).toBe(3849)
    expect(metadata.size).toBeGreaterThan(0)
  })
})

// describe('parseArgs()', () => {
//   it('should return the first positional argument', () => {
//     expect(parseArgs(['Ada Lovelace'])).toBe('Ada Lovelace')
//   })

//   it('should return undefined when no arguments are given', () => {
//     expect(parseArgs([])).toBeUndefined()
//   })
// })

// describe('OptiPic.load', () => {
//   it('should return a personalized greeting when a valid name is provided', () => {
//     const result = generateGreeting('Ada Lovelace')
//     expect(result).toBe('Hello, Ada Lovelace!')
//   })

//   it('should return a greeting for Brian Kernighan when no argument is passed', () => {
//     const result = generateGreeting()
//     expect(result).toBe('Hello, Brian Kernighan!')
//   })

//   it('should return a guest greeting when the input is an empty or blank string', () => {
//     // Testing edge cases handled by name.trim()
//     expect(generateGreeting('')).toBe('Hello, Guest!')
//     expect(generateGreeting('   ')).toBe('Hello, Guest!')
//   })

//   it('should return a guest greeting when the input is not a string data type', () => {
//     // The type system rules this out at compile time; the guard clause is what
//     // protects the function at runtime against values that bypass it (e.g. from
//     // untyped callers, JSON.parse output, or other JS consumers of this module).
//     // @ts-expect-error - intentionally passing a non-string to exercise the guard
//     expect(generateGreeting(123)).toBe('Hello, Guest!')
//     // @ts-expect-error - intentionally passing a non-string to exercise the guard
//     expect(generateGreeting(null)).toBe('Hello, Guest!')
//     // @ts-expect-error - intentionally passing a non-string to exercise the guard
//     expect(generateGreeting(true)).toBe('Hello, Guest!')
//   })
// })
