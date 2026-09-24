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
   * Store image path.
   *
   * @param path Path to image
   */
  public load(path: string) {
    console.log('Loaded' + path)
    this.imagePath = path
  }
}
