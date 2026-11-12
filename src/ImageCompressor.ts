import sharp from 'sharp'

type CompressorOptions = {
  maxSizeKB: number
  width: number
}

const START_QUALITY = 80
const MIN_QUALITY = 24
const QUALITY_STEP = 4
const BYTES_PER_KB = 1024

/**
 * Compress image to a set width and a maximum size in KB by lowering the JPEG quality step by step.
 *
 * @param image - Image in buffer format
 * @param options - Compression settings
 * @param options.maxSizeKB - Maximum file size of the compressed image in KB
 * @param options.width - Width of the compressed image in pixels
 * @returns Compressed image in buffer format
 */
export async function imageCompressor(image: Buffer, { maxSizeKB, width }: CompressorOptions): Promise<Buffer> {
  for (let quality = START_QUALITY; quality >= MIN_QUALITY; quality -= QUALITY_STEP) {
    const output = await encodeAsJpeg(image, width, quality)

    if (isWithinSizeLimit(output, maxSizeKB)) {
      return output
    }
  }

  throw new Error('Could not reach target file size. Try increasing maxSizeKB or using a smaller width')
}

/**
 * Uses sharp to resize the image and encode it as JPEG.
 *
 * @param image - Image in buffer format
 * @param width - Width in pixels
 * @param quality - JPEG quality
 * @returns Encoded image in buffer format
 */
function encodeAsJpeg(image: Buffer, width: number, quality: number): Promise<Buffer> {
  return sharp(image).resize({ width }).jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer()
}

/**
 * Checks if an image is small enough.
 *
 * @param image - Image in buffer format
 * @param maxSizeKB - Maximum file size in KB
 * @returns True if the image is within the limit
 */
function isWithinSizeLimit(image: Buffer, maxSizeKB: number): boolean {
  return image.length / BYTES_PER_KB <= maxSizeKB
}
