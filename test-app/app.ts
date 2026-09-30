import { OptiPic } from "../src"
/**
 * Execution entry point.
 */
async function main(): Promise<void> {
  console.log('🚀 Welcome to the OptiPic: Image Web Optimizer Test!')

  try {
    const op = new OptiPic()
    console.log('An OptiPic instance created!')

    await op.load('https://images.pexels.com/photos/33582812/pexels-photo-33582812.jpeg')
    console.log(`Loaded a ${op.getMetadata().height}x${op.getMetadata().width}px ${op.getMetadata().format} image with a size of ${op.getMetadata().size} bytes.`)
    await op.compress({width: 700, outputName: 'hello'})
    console.log('Compression done!')

  } catch (error) {
    console.error('An unexpected error occurred during execution:', (error as Error).message)
    process.exitCode = 1
  }
}

main()
