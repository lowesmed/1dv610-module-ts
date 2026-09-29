import sharp from 'sharp'

type CompressorOptions = {
  maxSizeKB?: number
  width?: number
}

/**
 * Compress image with to a maximum size in KB and a set width.
 *
 * @param image - Image in buffer format
 * @param param1 - Object with options listed below
 * @param param1.maxSizeKB - Maximum file size of compressed image
 * @param param1.width - Set width of compressed image
 * @returns Compressed Image in buffer data
 */
export async function imageCompressor(image: Buffer, { maxSizeKB = 400, width = 1200}: CompressorOptions = {}): Promise<Buffer> {

  let quality = 80
  const minQuality = 24
  const step = 4

  while (quality >= minQuality) {
    const output = await sharp(image).resize({ width: width }).jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4'}).toBuffer()

    console.log(quality, output.length / 1024)
    if (output.length / 1024 <= maxSizeKB) {
      return output
    }

    quality -= step
  }

  throw new Error('Could not reach targfile size. Try increase maxSizeKB or minWidth')

}
