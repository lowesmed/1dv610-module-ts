/**
 * @file Module for the class OptiPic.
 * @module src/OptiPic
 * @author Lowe Smed <ls222cg@student.lnu.se>
 * @version 1.0.0
 */

import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import { validateImageFormat, isUrl } from './SourceValidator.js'

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
   * Data from loaded image.
   */
  private imageData : Buffer | undefined

  /**
   * Metadata from image.
   *
   * @private
   * @type {(ImageMetadata | undefined)}
   * @memberof OptiPic
   */
  private imageMetadata : ImageMetadata | undefined
  /**
   * Initiziates OptiPic.
   */
  constructor () {
    console.log('OptiPic instance created!')
  }

  /**
   * Load a valid image from url or file
   *
   * @param source Path to image
   */
  public async load(source: string): Promise<void> {
    validateImageFormat(source)

    const data = (isUrl(source)) ? await this.loadFromUrl(source) : await this.loadFromFile(source)

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
   */
  private async loadFromUrl(url: string): Promise<Buffer> {
    console.log("Its a url! " + url)
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
      size: metadata.size ?? 0
    }
  }
}
