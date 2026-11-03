import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { OptiPic } from './index.js'
import { fileURLToPath } from 'node:url'

const samplePath = fileURLToPath(new URL('../test-app/input/midsommartallrik.jpg', import.meta.url))
const sampleUrl = 'https://images.pexels.com/photos/33582812/pexels-photo-33582812.jpeg'
const OUTPUT_DIR = path.join(process.cwd(), 'output')

describe('OptiPic', () => {
  it('Reads metadata from a JPEG URL', async () => {
    const image = new OptiPic()

    // Change this in case test fails because of image not being available. Must link to an jpg/jpeg image.
    await image.load(sampleUrl)

    const metadata = image.getMetadata()

    expect(metadata.format).toBe('jpeg')
    expect(metadata.width).toBe(2887)
    expect(metadata.height).toBe(3849)
    expect(metadata.size).toBeGreaterThan(0)
  }, 30_000)

  it('throws if metadata is requested before loading', () => {
    const image = new OptiPic()
    expect(() => image.getMetadata()).toThrow('No image has been loaded')
  })

  it('rejects a source that is not a JPEG', async () => {
    const image = new OptiPic()
    await expect(image.load('picture.png')).rejects.toThrow('The image must be in jpg/jpeg format')
  })

  it('compressToBuffer() returns a Buffer with image data', async () => {
    const image = new OptiPic()
    await image.load(samplePath)

    const buffer = await image.compressToBuffer({ width: 400 })

    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('throws if no image has been loaded', async () => {
    const image = new OptiPic()

    await expect(image.compress()).rejects.toThrow('No image has been loaded')
    await expect(image.compressToBuffer()).rejects.toThrow('No image has been loaded')
    await expect(image.compressVariants()).rejects.toThrow('No image has been loaded')
  })

  it('compressVariants() takes an array of compression options', async () => {
    const optiPic = new OptiPic()
    await optiPic.load(samplePath)

    const input = [{width: 600, outputName: 'image-name'}]

    await expect(optiPic.compressVariants(input)).resolves.not.toThrow()
  })

  it('compressVariants() with no arguments uses default widths', async () => {
    const optiPic = new OptiPic()
    await optiPic.load(samplePath)

    await expect(optiPic.compressVariants()).resolves.not.toThrow()
  })
})

describe('OptiPic.compressVariants()', () => {
  beforeEach(() => {
    rmSync(OUTPUT_DIR, { recursive: true, force: true })
  })

  afterEach(() => {
    rmSync(OUTPUT_DIR, { recursive: true, force: true })
  })

  it('Called with no arguments uses default widths', async () => {
    const optiPic = new OptiPic()
    await optiPic.load(samplePath)
    await optiPic.compressVariants()

    expect(existsSync(OUTPUT_DIR)).toBe(true)

    const imageFiles = readdirSync(OUTPUT_DIR)
    expect(imageFiles).toHaveLength(3)
  })
})
