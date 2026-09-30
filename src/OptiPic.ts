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
   * Loads a valid image from a source (URL or file path)
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
   * Compress the loaded image using default values or choosen options and save it.
   *
   * @param options - Compression and output settings.
   * @param options.width - Output width in pixels (default 1200).
   * @param options.maxSizeKB - Target maximum file size in KB (default 400).
   * @param options.outputName - Optional output file name. If omitted, a name is generated automatically.
   */
  public async compress({ width = 1200, maxSizeKB = 400, outputName }: CompressOptions = {}): Promise<void> {
    const image = this.imageData

    if (image === undefined) {
      throw new Error('No image has been loaded')
    }

    const fileName = outputName ?? this.makeFileName(width)
    const compressedImage = await imageCompressor(image, { maxSizeKB, width })

    await this.saveImageToFile(compressedImage, fileName)
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
