/**
 * @file Module for the class OptiPic.
 * @module src/OptiPic
 * @author Lowe Smed <ls222cg@student.lnu.se>
 * @version 1.0.0
 */

import { readFile } from 'node:fs/promises'

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
   * Load image from url or file
   *
   * @param source Path to image
   */
  public load(source: string) {
    if (this.isUrl(source)) {
      console.log('Its a URL')
    }
    this.loadFromFile(source)
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
}
