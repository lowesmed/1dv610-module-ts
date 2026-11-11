import { OptiPic } from "../src"
import { fileURLToPath } from 'node:url'

const SAMPLE_PATH = fileURLToPath(new URL('../test-app/input/midsommartallrik.jpg', import.meta.url))
/**
 * Execution entry point.
 */
async function main(): Promise<void> {
  console.log('🚀 Welcome to the OptiPic: Image Web Optimizer Test!')

  try {
    const op = new OptiPic()
    console.log('An OptiPic instance has been created!')

    console.log('Load image from path..')
    await op.load(SAMPLE_PATH)

    console.log(`Loaded a ${op.getMetadata().height}x${op.getMetadata().width}px ${op.getMetadata().format} image with a size of ${op.getMetadata().size} bytes.`)

    console.log('Compressing to file..')
    await op.compressToFile()

    console.log('Saved!')

    console.log('Now load image from url..')
    await op.load('https://images.pexels.com/photos/33582812/pexels-photo-33582812.jpeg')

    console.log(`Loaded a ${op.getMetadata().height}x${op.getMetadata().width}px ${op.getMetadata().format} image with a size of ${op.getMetadata().size} bytes.`)

    console.log('Compressing to file..')
    await op.compressToFile()

    console.log('Saved!')

    console.log('Creating web optimized variants of this image..')

    console.log('Compressing to files..')
    await op.compressVariantsToFiles()

    console.log('Saved!')

  } catch (error) {
    console.error('An unexpected error occurred during execution:', (error as Error).message)
    process.exitCode = 1
  }
}

main()
