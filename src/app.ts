#!/usr/bin/env node

import { OptiPic } from "./OptiPic.js"

/**
 * Execution entry point.
 */
function main(): void {
  console.log('🚀 Welcome to the Image Web Optimizer!')

  try {
    const image = new OptiPic('./hello.png')
    console.log(image)
  } catch (error) {
    console.error('An unexpected error occurred during execution:', (error as Error).message)
    process.exitCode = 1
  }
}

main()
