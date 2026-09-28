/**
 * Make sure source is a valid image format.
 *
 * @param source - URL or path to image
 */
export function validateImageFormat(source: string) {
  if (!source.toLocaleLowerCase().endsWith('jpg')) {
    throw Error('The image must be in .jpg format')
  }
}
