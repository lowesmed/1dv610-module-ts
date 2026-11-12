/* eslint-disable security/detect-non-literal-fs-filename -- tests read and delete their own output files */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { OptiPic } from './index.js'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// Change these in case test fails because of image not being available.
const SAMPLE_URL = 'https://images.pexels.com/photos/33582812/pexels-photo-33582812.jpeg'
const SAMPLE_URL_PNG = 'https://example.com/cat.png'
const SAMPLE_PATH = fileURLToPath(new URL('../test-app/input/midsommartallrik.jpg', import.meta.url))

describe('OptiPic with options', () => {
  it('uses the default values that are passed', () => {
    const optiPic = new OptiPic({ width: 400, maxSizeKB: 600, variantsWidths: [200, 300, 400] })

    expect(optiPic.getDefaultWidth()).toBe(400)
    expect(optiPic.getDefaultMaxSizeKB()).toBe(600)
    expect(optiPic.getDefaultVariantsWidths()).toEqual([200, 300, 400])
  })

  it('applies the passed default when compressing', { timeout: 30000 }, async () => {
    const optiPic = new OptiPic({ width: 400 })
    await optiPic.load(SAMPLE_URL)

    const metadata = await sharp(await optiPic.compressToBuffer()).metadata()

    expect(metadata.width).toBe(400)
  })

  it('rejects defaults that are not valid', () => {
    expect(() => new OptiPic({ width: -5 })).toThrow('width must be a positive whole number')
    expect(() => new OptiPic({ maxSizeKB: 0 })).toThrow('maxSizeKB must be a positive whole number')
    expect(() => new OptiPic({ variantsWidths: [] })).toThrow('variantsWidths must contain at least one width')
  })
})

describe('OptiPic load()', () => {
  it('throws if source is .png format', async () => {
    const optiPic = new OptiPic()

    await expect(optiPic.load(SAMPLE_URL)).resolves.toBeUndefined()
  })

  it('successfully loads if source is .jpeg/.jpg format', async () => {
    const optiPic = new OptiPic()

    await expect(optiPic.load(SAMPLE_URL_PNG)).rejects.toThrow('The image must be in jpg/jpeg format')
  })

  it('throws when the URL request fails', async () => {
    const optiPic = new OptiPic()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 404 }))

    await expect(optiPic.load('https://missing.com/file.jpg')).rejects.toThrow('Could not load image: 404')

    fetchSpy.mockRestore()
  })
})

describe('OptiPic compressToFile()', { timeout: 30000 }, () => {
  const optiPic = new OptiPic()
  const outputFile = (name: string): string => path.resolve('./output', name + '.jpg')
  const testFiles = ['test-to-file', 'test-deprecated']

  beforeAll(async () => {
    await optiPic.load(SAMPLE_PATH)
  })

  afterAll(async () => {
    await Promise.all(testFiles.map((name) => rm(outputFile(name), { force: true })))
  })

  it('saves the image with the given name and width', async () => {
    await optiPic.compressToFile({ width: 300, outputName: 'test-to-file' })

    const metadata = await sharp(outputFile('test-to-file')).metadata()

    expect(metadata.width).toBe(300)
  })

  it('compress() still works, but warns that it is deprecated', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await optiPic.compress({ width: 300, outputName: 'test-deprecated' })

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('deprecated'))
    expect(await stat(outputFile('test-deprecated'))).toBeDefined()

    warn.mockRestore()
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

  it('throws when size limit cannot be reached', async () => {
    await expect(optiPic.compressToBuffer({ maxSizeKB: 1 })).rejects.toThrow('Could not reach target file size')
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
  const testFiles = ['test-variants-a', 'test-variants-b']

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
