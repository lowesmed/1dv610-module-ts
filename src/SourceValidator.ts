/**
 * Throws if the source is not a .jpg or .jpeg image. A query string in a URL is ignored.
 *
 * @param source - URL or file path to image
 */
export function validateImageFormat(source: string): void {
  const path = isUrl(source) ? new URL(source).pathname : source
  const lowerCasePath = path.toLowerCase()

  if (!lowerCasePath.endsWith('.jpg') && !lowerCasePath.endsWith('.jpeg')) {
    throw new Error('The image must be in jpg/jpeg format')
  }
}

/**
 * Checks if source is a path or a http/https URL.
 *
 * @param source - URL or path to image
 * @returns True if source is URL, false if it's a file path
 */
export function isUrl(source: string): boolean {
  if (!URL.canParse(source)) {
    return false
  }

  const protocol = new URL(source).protocol

  return protocol === 'http:' || protocol === 'https:'
}
