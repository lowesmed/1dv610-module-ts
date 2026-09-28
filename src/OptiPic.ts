/**
 * @file Module for the class OptiPic.
 * @module src/OptiPic
 * @author Lowe Smed <ls222cg@student.lnu.se>
 * @version 1.0.0
 */

import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import { validateImageFormat } from './SourceValidator.js'

/**
 * Represents a OptiPic instance.
 */
export class OptiPic {
  /**
   * Data from loaded image
   */
  private imageData : Buffer | undefined

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
  public async load(source: string) {
    validateImageFormat(source)

    if (this.isUrl(source)) {
      console.log('Its a URL')
    }
    this.imageData = await this.loadFromFile(source)
    console.log(this.imageData)
  }

  /**
   * Checks if source is a url.
   *
   * @param source Source string
   * @returns {boolean} True if url, false if not
   */
  private isUrl(source: string): boolean {
    return source.includes('http')
  }

  private async loadFromFile(path: string): Promise<Buffer> {
    const data = await readFile(path)
    console.log(data)
    return data
  }

  public async getWidth() {

    const image = new sharp(this.imageData).metadata()
    const metadata = await image
    console.log(metadata.width)
  //   image.on('info', ({ height }) => {
  //   console.log(`Image height is ${height}`);
  // })
  }
}
