/**
 * @file Module for the class OptiPic.
 * @module src/OptiPic
 * @author Lowe Smed <ls222cg@student.lnu.se>
 * @version 1.0.0
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import sharp from 'sharp'
import { validateImageFormat, isUrl } from './SourceValidator.js'
import { imageCompressor } from './ImageCompressor.js'
import { validatePositiveInteger } from './OptionsValidator.js'

export type OptiPicDefaults = {
  width?: number
  maxSizeKB?: number
  variantsWidths?: number[]
}

export type ImageMetadata = {
  format: string
  width: number
  height: number
  size: number
}

export type CompressOptions = {
  width?: number
  maxSizeKB?: number
  outputName?: string
}

type ResolvedVariant = {
  width: number
  maxSizeKB: number
  outputName: string
}

/**
 * Represents a OptiPic instance.
 */
export class OptiPic {
  /**
   * Data of loaded image.
   */
  private imageData: Buffer | undefined

  /**
   * Metadata of image.
   */
  private imageMetadata: ImageMetadata | undefined

  /**
   * Compressed image width if setting is not provided
   */
  private readonly defaultWidth: number

  /**
   * Compressed image max size if setting is not provided
   */
  private readonly defaultMaxSizeKB: number

  /**
   * Used as default widths for image variables if non provided
   */
  private readonly defaultVariantsWidths: number[]

  /**
   * Creates an OptiPic instance. All settings are optional and replaces the built-in defaults.
   *
   * @param defaults - Default settings used when a method is called without them
   * @param defaults.width - Default output width in pixels (default 1200)
   * @param defaults.maxSizeKB - Default maximum file size in KB (default 400)
   * @param defaults.variantsWidths - Default widths for variants (default 480, 768 and 1280)
   */
  constructor({ width = 1200, maxSizeKB = 400, variantsWidths = [480, 768, 1280] }: OptiPicDefaults = {}) {
    validatePositiveInteger(width, 'width')
    validatePositiveInteger(maxSizeKB, 'maxSizeKB')

    if (variantsWidths.length === 0) {
      throw new Error('variantsWidths must contain at least one width')
    }

    variantsWidths.forEach((variant) => validatePositiveInteger(variant, 'variantsWidths'))

    this.defaultWidth = width
    this.defaultMaxSizeKB = maxSizeKB
    this.defaultVariantsWidths = [...variantsWidths]
  }

  /**
   * Loads a valid image from a URL or file path source.
   *
   * @param source - URL or file path to image
   */
  public async load(source: string): Promise<void> {
    validateImageFormat(source)

    const data = isUrl(source) ? await this.loadFromUrl(source) : await this.loadFromFile(source)

    const metadata = await this.readMetadata(data)

    this.imageData = data
    this.imageMetadata = metadata
  }

  /**
   * Reads the image file from disk and returns its raw bytes.
   *
   * @param filePath - Path to a image file
   * @returns The file contents as a Buffer
   */
  private async loadFromFile(filePath: string): Promise<Buffer> {
    // The caller chooses which image to load, so a non-literal path is intended.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return await readFile(filePath)
  }

  /**
   * Collect Image data using a URL source.
   *
   * @param url - URL to image
   * @returns Image buffer data
   */
  private async loadFromUrl(url: string): Promise<Buffer> {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Could not load image: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()

    return Buffer.from(arrayBuffer)
  }

  /**
   * Read metadata from loaded image using Sharp.
   *
   * @param data Buffer data from image.
   * @returns Image metadata object.
   */
  private async readMetadata(data: Buffer): Promise<ImageMetadata> {
    const metadata = await sharp(data).metadata()

    return {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      size: metadata.size ?? 0,
    }
  }

  /**
   * Compress the loaded image using default values or chosen settings and save it.
   *
   * @param options - Compression and output settings.
   * @param options.width - Output width in pixels (default 1200).
   * @param options.maxSizeKB - Target maximum file size in KB (default 400).
   * @param options.outputName - Optional output file name. If omitted, a name is generated automatically.
   */
  public async compressToFile({
    width = this.defaultWidth,
    maxSizeKB = this.defaultMaxSizeKB,
    outputName,
  }: CompressOptions = {}): Promise<void> {
    const image = this.getLoadedImage()

    const fileName = outputName ?? this.makeFileName(width)
    const compressedImage = await imageCompressor(image, { maxSizeKB, width })

    await this.saveImageToFile(compressedImage, fileName)
  }

  /**
   * Makes sure updating module doesn't break compatibility by calling new method.
   *
   * @deprecated Use compressToFile() instead. compress() will be removed in the next major version.
   * @param options - Same options as compressToFile()
   */
  public async compress(options: CompressOptions = {}): Promise<void> {
    console.warn('OptiPic.compress() is deprecated. Use compressToFile() instead.')

    await this.compressToFile(options)
  }

  /**
   * Compress the loaded image using default values or chosen settings and returns as buffer. Output name option is ignored.
   *
   * @param options - Compression and output settings.
   * @param options.width - Output width in pixels (default 1200).
   * @param options.maxSizeKB - Target maximum file size in KB (default 400).
   * @returns Image buffer.
   */
  public async compressToBuffer({
    width = this.defaultWidth,
    maxSizeKB = this.defaultMaxSizeKB,
  }: CompressOptions = {}): Promise<Buffer> {
    const image = this.getLoadedImage()

    return await imageCompressor(image, { maxSizeKB, width })
  }

  /**
   * Create multiple compressed images with different widths and save them. Uses defaults if called empty.
   *
   * @param variants - Optional array of variants compression options
   */
  public async compressVariantsToFiles(variants?: CompressOptions[]): Promise<void> {
    const resolvedVariants = this.resolveVariants(variants)
    const buffers = await this.compressAll(resolvedVariants)

    const saves = buffers.map((buffer, index) => this.saveImageToFile(buffer, resolvedVariants[index].outputName))

    await Promise.all(saves)
  }

  /**
   * Create multiple compressed images with different widths and return them as buffers. Output name option is ignored.
   *
   * @param variants - Optional array of variant compression options
   * @returns Compressed images as buffers
   */
  public async compressVariantsToBuffers(variants?: CompressOptions[]): Promise<Buffer[]> {
    return await this.compressAll(this.resolveVariants(variants))
  }

  /**
   * Fills in missing options for every variant so the rest of the code never has to check for undefined.
   *
   * @param variants - Variant options from the caller, or undefined to use the default widths
   * @returns One complete variant per requested variant
   */
  private resolveVariants(variants?: CompressOptions[]): ResolvedVariant[] {
    const requestedVariants: CompressOptions[] = variants ?? this.defaultVariantsWidths.map((width) => ({ width }))

    return requestedVariants.map((variant, index) => {
      const width = variant.width ?? this.defaultVariantsWidths[index] ?? this.defaultWidth

      return {
        width,
        maxSizeKB: variant.maxSizeKB ?? this.defaultMaxSizeKB,
        outputName: variant.outputName ?? this.makeFileName(width),
      }
    })
  }

  /**
   * Compress the loaded image for every variant.
   *
   * @param variants - Complete variants
   * @returns Compressed buffers in same order as variants
   */
  private async compressAll(variants: ResolvedVariant[]): Promise<Buffer[]> {
    const image = this.getLoadedImage()

    const compressions = variants.map(({ width, maxSizeKB }) => imageCompressor(image, { width, maxSizeKB }))

    return await Promise.all(compressions)
  }

  /**
   * Metadata for the currently loaded image.
   *
   * @returns A copy of the loaded image's metadata.
   */
  public getMetadata(): ImageMetadata {
    if (this.imageMetadata === undefined) {
      throw new Error('No image has been loaded')
    }
    return { ...this.imageMetadata }
  }

  /**
   * Default widths used when creating image variants.
   *
   * @returns Widths in pixels.
   */
  public getDefaultVariantsWidths(): number[] {
    return [...this.defaultVariantsWidths]
  }

  /**
   * The default width of a single compressed image.
   *
   * @returns Width in pixels.
   */
  public getDefaultWidth(): number {
    return this.defaultWidth
  }

  /**
   * The default max size of a single compressed image.
   *
   * @returns Size in KB.
   */
  public getDefaultMaxSizeKB(): number {
    return this.defaultMaxSizeKB
  }

  /**
   * Return image data if not undefined.
   *
   * @returns Image buffer data
   */
  private getLoadedImage(): Buffer {
    if (this.imageData === undefined) {
      throw new Error('No image has been loaded')
    }
    return this.imageData
  }

  /**
   * Writes image to a folder named output in root
   *
   * @param image - Image as buffer data
   * @param outputName - Name of file
   */
  private async saveImageToFile(image: Buffer, outputName: string): Promise<void> {
    const outputDirectory = path.resolve('./output')
    await mkdir(outputDirectory, { recursive: true })

    // The output name is chosen by the caller (or generated), so a non-literal path is intended.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await writeFile(path.join(outputDirectory, outputName + '.jpg'), image)
  }

  /**
   * Makes a filename of random hex and width of image.
   *
   * @param width - With of image
   * @returns A random name including width
   */
  private makeFileName(width: number): string {
    return `${randomBytes(3).toString('hex')}-w${width}`
  }
}
