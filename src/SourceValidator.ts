/**
 * Make sure source is a valid image format.
 *
 * @param source - URL or path to image
 */
export function validateImageFormat(source: string) {
  if (!source.toLocaleLowerCase().endsWith('jpg') && !source.toLocaleLowerCase().endsWith('jpeg')) {
    throw Error('The image must be in jpg/jpeg format')
  }
}

/**
 * Checks if source is a url.
 *
 * @param source - URL or path to image
 * @returns {boolean} True if url, false if not
 */
export function isUrl(source: string): boolean {
  return source.includes('http')
}
