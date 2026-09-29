/**
 * @file Module for the class OptiPic.
 * @module src/OptiPic
 * @author Lowe Smed <ls222cg@student.lnu.se>
 * @version 1.0.0
 */

import { readFile } from 'node:fs/promises'
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { validateImageFormat, isUrl } from './SourceValidator.js'
import { imageCompressor } from "./ImageCompressor.js"

type ImageMetadata = {
  format: string
  width: number
  height: number
  size: number
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
   * Initiziates OptiPic.
   */
  constructor() {
    console.log('OptiPic instance created!')
  }

  /**
   * Load a valid image from url or file
   *
   * @param source Path to image
   */
  public async load(source: string): Promise<void> {
    validateImageFormat(source)

    const data = isUrl(source) ? await this.loadFromUrl(source) : await this.loadFromFile(source)

    const metadata = await this.readMetadata(data)

    this.imageData = data
    this.imageMetadata = metadata
  }

  /**
   * Collect Image data using file path.
   *
   * @param path - Path to image to load
   * @returns Image buffer data
   */
  private async loadFromFile(path: string): Promise<Buffer> {
    const data = await readFile(path)

    return data
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
   * @returns Image metadata object
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
    return {...this.imageMetadata}
  }

  /**
   * ADD.
   */
  public async compress() {
    console.log('Compressor here!')
    const image = this.imageData

    if(image === undefined) {
      throw new Error('No image has been loaded')
    }
    const compressed = await imageCompressor(image, 200)
    await writeFile('compressed.jpg', compressed)
    const metadata = await sharp(compressed).metadata()
    console.log(metadata.size)
    // Default 400kb
    // Call compressor
    // Compressor returns new Buffer
    // imageCompressor(this.imageData, 4000)
  }
}
