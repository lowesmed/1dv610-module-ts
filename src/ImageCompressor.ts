import sharp from 'sharp'

/**
 * add.
 *
 * @param image add
 * @param maxSizeKB add
 * @returns add
 */
export async function imageCompressor(image: Buffer, maxSizeKB: number) {

  let quality = 80
  const minQuality = 24
  const step = 4

  while (quality >= minQuality) {
    const output = await sharp(image).resize({ width: 2000 }).jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4'}).toBuffer()

    console.log(quality, output.length / 1024)
    if (output.length / 1024 <= maxSizeKB) {
      return output
    }

    quality -= step
  }

  throw new Error('Could not reach targfile size. Try increase maxSizeKB or minWidth')

}
