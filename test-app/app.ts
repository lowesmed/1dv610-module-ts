import { OptiPic } from "../src"
// import { imageCompressor } from "../src/ImageCompressor"

/**
 * Execution entry point.
 */
async function main(): Promise<void> {
  console.log('🚀 Welcome to the Image Web Optimizer!')

  try {
    const op = new OptiPic()
    await op.load('https://images.pexels.com/photos/33582812/pexels-photo-33582812.jpeg')
    console.log(op.getMetadata())
    await op.compress({width: 700, outputName: 'hello'})
    console.log(op.getMetadata())

  } catch (error) {
    console.error('An unexpected error occurred during execution:', (error as Error).message)
    process.exitCode = 1
  }
}

main()
