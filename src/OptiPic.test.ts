import { describe, it, expect, beforeAll, afterAll } from 'vitest'
// import { existsSync, readdirSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import { OptiPic } from './index.js'
// import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// const SAMPLE_PATH = fileURLToPath(new URL('../test-app/input/midsommartallrik.jpg', import.meta.url))

// Change this in case test fails because of image not being available. Must link to an jpg/jpeg image.
const SAMPLE_URL = 'https://images.pexels.com/photos/33582812/pexels-photo-33582812.jpeg'
const SAMPLE_URL_PNG = 'https://en.wikipedia.org/wiki/PNG#/media/File:PNG_transparency_demonstration_1.png'
// const OUTPUT_DIR = path.join(process.cwd(), 'output')
// Snapshot helper so tests only count and remove files they created themselves.
// const listFiles = () => (existsSync(OUTPUT_DIR) ? readdirSync(OUTPUT_DIR) : [])

describe('OptiPic load()', () => {
  it('throws if source is .png format', async () => {
    const optiPic = new OptiPic()

    await expect(optiPic.load(SAMPLE_URL)).resolves.toBeUndefined()
  })

  it('successfully loads if source is .jpeg/.jpg format', async () => {
    const optiPic = new OptiPic()

    await expect(optiPic.load(SAMPLE_URL_PNG)).rejects.toThrow('The image must be in jpg/jpeg format')
  })
})

describe('OptiPic compressToBuffer()', { timeout: 30000 }, () => {
  const optiPic = new OptiPic()

  beforeAll(async () => {
    await optiPic.load(SAMPLE_URL)
  })

  it('returns a Buffer with image data', async () => {
    const buffer = await optiPic.compressToBuffer({ width: 400 })

    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })
})

describe('OptiPic compressVariantsToBuffers()', { timeout: 30000 }, () => {
  const optiPic = new OptiPic()

  beforeAll(async () => {
    await optiPic.load(SAMPLE_URL)
  })

  const widthsOf = async (buffers: Buffer[]): Promise<(number | undefined)[]> => {
    const metadata = await Promise.all(buffers.map((buffer) => sharp(buffer).metadata()))
    return metadata.map((data) => data.width)
  }

  it('uses the default widths when called without arguments', async () => {
    const buffers = await optiPic.compressVariantsToBuffers()

    expect(await widthsOf(buffers)).toEqual(optiPic.getDefaultVariantsWidths())
  })

  it('uses the given widths and size limits, in the same order ', async () => {
    const buffers = await optiPic.compressVariantsToBuffers([{ width: 300 }, { width: 600, maxSizeKB: 80 }])

    expect(await widthsOf(buffers)).toEqual([300, 600])
    expect(buffers[1].length / 1024).toBeLessThanOrEqual(80)
  })

  it('uses correct default width when one of two arguments does not define width', async () => {
    const buffers = await optiPic.compressVariantsToBuffers([{ width: 300 }, { maxSizeKB: 100 }])

    expect(await widthsOf(buffers)).toEqual([300, optiPic.getDefaultVariantsWidths()[1]])
  })

  it('uses the single image default when there are more variants than default widths', async () => {
    const buffers = await optiPic.compressVariantsToBuffers([{}, {}, {}, {}])

    expect(await widthsOf(buffers)).toEqual([
      optiPic.getDefaultVariantsWidths()[0],
      optiPic.getDefaultVariantsWidths()[1],
      optiPic.getDefaultVariantsWidths()[2],
      optiPic.getDefaultWidth(),
    ])
  })

  it('throws when no image has been loaded', async () => {
    const empty = new OptiPic()

    await expect(empty.compressVariantsToBuffers()).rejects.toThrow('No image has been loaded')
  })
})

describe('OptiPic compressVariantsToFiles()', { timeout: 30000 }, () => {
  const optiPic = new OptiPic()
  const outputFile = (name: string): string => path.resolve('./output', name + '.jpg')
  const testFiles = ['test-variants-a', 'test-variants-b', 'test-fail-a', 'test-fail-b']

  beforeAll(async () => {
    await optiPic.load(SAMPLE_URL)
  })

  afterAll(async () => {
    await Promise.all(testFiles.map((name) => rm(outputFile(name), { force: true })))
  })

  it('saves every variant using the gives names', async () => {
    await optiPic.compressVariantsToFiles([
      { width: 600, outputName: 'test-variants-a' },
      { width: 1200, outputName: 'test-variants-b' },
    ])

    const small = await sharp(outputFile('test-variants-a')).metadata()
    const large = await sharp(outputFile('test-variants-b')).metadata()

    expect(small.width).toBe(600)
    expect(large.width).toBe(1200)
  })
})

describe('OptiPic getMetaData()', () => {
  const optiPic = new OptiPic()

  it('throws if metadata is requested before loading', () => {
    expect(() => optiPic.getMetadata()).toThrow('No image has been loaded')
  })

  it('returns metadata with the expected fields and types', async () => {
    await optiPic.load(SAMPLE_URL)

    const metaData = optiPic.getMetadata()

    expect(metaData).toMatchObject({
      format: expect.any(String),
      height: expect.any(Number),
      width: expect.any(Number),
      size: expect.any(Number),
    })
  })
})

// it('Passing no arguments stores store files in output folder', async () => {
//   const optiPic = new OptiPic()
//   await optiPic.load(SAMPLE_URL)

//   const numberOfDefaultWidths = optiPic.getDefaultVariantsWidths().length

//   await expectCreatedFiles(
//     () => optiPic.compressVariants(),
//     (created) => expect(created).toHaveLength(numberOfDefaultWidths)
//   )
// })

// /**
//  * Runs an action, lets the test check the files it created in the output folder and then removes only those files (and the folder if the action created it).
//  *
//  * @param action - The call under test that writes files to the output folder.
//  * @param check - Runs the test's assertions on the new files, before cleanup deletes them.
//  */
// async function expectCreatedFiles(action: () => Promise<void>, check: (_created: string[]) => void) {
//   const folderExisted = existsSync(OUTPUT_DIR)
//   const before = new Set(listFiles())
//   const newFiles = () => listFiles().filter((f) => !before.has(f))

//   try {
//     await action()
//     check(newFiles())
//   } finally {
//     for (const file of newFiles()) {
//       rmSync(path.join(OUTPUT_DIR, file), { force: true })
//     }

//     if (!folderExisted && listFiles().length === 0) {
//       rmSync(OUTPUT_DIR, { recursive: true, force: true })
//     }
//   }
// }
