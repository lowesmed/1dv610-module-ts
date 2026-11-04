import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { OptiPic } from './index.js'
import { fileURLToPath } from 'node:url'

const SAMPLE_PATH = fileURLToPath(new URL('../test-app/input/midsommartallrik.jpg', import.meta.url))
const SAMPLE_URL = 'https://images.pexels.com/photos/33582812/pexels-photo-33582812.jpeg'
const OUTPUT_DIR = path.join(process.cwd(), 'output')
// Snapshot helper so tests only count and remove files they created themselves.
const listFiles = () => (existsSync(OUTPUT_DIR) ? readdirSync(OUTPUT_DIR) : [])

describe('OptiPic', () => {
  it('Reads metadata from a JPEG URL', async () => {
    const image = new OptiPic()

    // Change this in case test fails because of image not being available. Must link to an jpg/jpeg image.
    await image.load(SAMPLE_URL)

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
    await image.load(SAMPLE_PATH)

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
})

describe('OptiPic.compressVariants()', () => {
  it('Called with no arguments uses default widths', async () => {
    const optiPic = new OptiPic()
    await optiPic.load(SAMPLE_URL)

    await expectCreatedFiles(
      () => optiPic.compressVariants(),
      (created) => expect(created).toHaveLength(3) // number of default widths
    )
  }, 30_000)
})

/**
 * Runs an action, lets the test check the files it created in the output folder and then removes only those files (and the folder if the action created it).
 *
 * @param action - The call under test that writes files to the output folder.
 * @param check - Runs the test's assertions on the new files, before cleanup deletes them.
 */
async function expectCreatedFiles(action: () => Promise<void>, check: (_created: string[]) => void) {
  const folderExisted = existsSync(OUTPUT_DIR)
  const before = new Set(listFiles())
  const newFiles = () => listFiles().filter((f) => !before.has(f))

  try {
    await action()
    check(newFiles())
  } finally {
    for (const file of newFiles()) {
      rmSync(path.join(OUTPUT_DIR, file), { force: true })
    }

    if (!folderExisted && listFiles().length === 0) {
      rmSync(OUTPUT_DIR, { recursive: true, force: true })
    }
  }
}
