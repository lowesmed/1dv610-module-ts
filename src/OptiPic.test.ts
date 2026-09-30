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

  it('throws if metadata is requested before loading', () => {
    const image = new OptiPic()
    expect(() => image.getMetadata()).toThrow('No image has been loaded')
  })

  it('rejects a source that is not a JPEG', async () => {
    const image = new OptiPic()
    await expect(image.load('picture.png')).rejects.toThrow('The image must be in jpg/jpeg format')
  })
})
