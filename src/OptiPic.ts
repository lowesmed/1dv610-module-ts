/**
 * @file Module for the class OptiPic.
 * @module src/OptiPic
 * @author Lowe Smed <ls222cg@student.lnu.se>
 * @version 1.0.0
 */


/**
 * Represents the OptiPic
 */
export class OptiPic {
  /**
   * Path of image to optimize.
   */
  #imagePath

  /**
   * Initiziates OptiPic.
   *
   * @param path Path to image
   */
  constructor (path: string) {
    this.#imagePath = path
    console.log(this.#imagePath)
  }
}
