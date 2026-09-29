import { OptiPic } from "../src"

/**
 * Execution entry point.
 */
function main(): void {
  console.log('🚀 Welcome to the Image Web Optimizer!')

  try {
    const op = new OptiPic()
    op.load('https://images.pexels.com/photos/33582812/pexels-photo-33582812.jpeg')
    op.getMetadata()
  } catch (error) {
    console.error('An unexpected error occurred during execution:', (error as Error).message)
    process.exitCode = 1
  }
}

main()
