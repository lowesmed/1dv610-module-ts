/**
 * @file Module for the class OptiPic.
 * @module src/OptiPic
 * @author Lowe Smed <ls222cg@student.lnu.se>
 * @version 1.0.0
 */


/**
 * Represents a OptiPic instance.
 */
export class OptiPic {
  /**
   * Path of image to optimize.
   */
  private imagePath : string | undefined

  /**
   * Initiziates OptiPic.
   */
  constructor () {
    console.log('OptiPic instance created!')
  }

  /**
   * Stores image source.
   *
   * @param source Path to image
   */
  public load(source: string) {
    console.log('Loaded' + source)
    this.imagePath = source
    console.log(this.isUrl(source))
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
}
