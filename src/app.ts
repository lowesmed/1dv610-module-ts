#!/usr/bin/env node

import { OptiPic } from "./OptiPic.js"

/**
 * Execution entry point.
 */
function main(): void {
  console.log('🚀 Welcome to the Image Web Optimizer!')

  try {
    const op = new OptiPic()
    op.load('/image.png')
  } catch (error) {
    console.error('An unexpected error occurred during execution:', (error as Error).message)
    process.exitCode = 1
  }
}

main()
