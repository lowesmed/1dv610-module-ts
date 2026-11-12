import { describe, it, expect } from 'vitest'
import { validatePositiveInteger } from './OptionsValidator.js'

describe('validatePositiveInteger()', () => {
  it('accepts positive whole numbers', () => {
    expect(() => validatePositiveInteger(1, 'maxSizeKB')).not.toThrow()
    expect(() => validatePositiveInteger(1200, 'maxSizeKB')).not.toThrow()
  })

  it('rejects zero, negative number, decimals and NaN', () => {
    expect(() => validatePositiveInteger(0, 'width')).toThrow('width must be a positive whole number')
    expect(() => validatePositiveInteger(-1, 'width')).toThrow('width must be a positive whole number')
    expect(() => validatePositiveInteger(1.5, 'width')).toThrow('width must be a positive whole number')
    expect(() => validatePositiveInteger(NaN, 'width')).toThrow('width must be a positive whole number')
  })

  it('uses the given name in the error message', () => {
    expect(() => validatePositiveInteger(-1, 'maxSizeKB')).toThrow('maxSizeKB must be a positive whole number')
  })
})
