#!/usr/bin/env node

/**
 * Extracts the name argument from the command line.
 *
 * @example
 * parseArgs(['Ada Lovelace']) // Returns 'Ada Lovelace'
 * parseArgs([]) // Returns undefined
 * @param argv - Command-line arguments, excluding the node executable and
 *   script path (i.e. `process.argv.slice(2)`).
 * @returns The first positional argument, if any.
 */
export function parseArgs(argv: string[]): string | undefined {
  return argv[0]
}

/**
 * Generates a formatted greeting message.
 *
 * @example
 * generateGreeting('Ada Lovelace') // Returns 'Hello, Ada Lovelace!'
 * @param name - The name of the person to greet.
 * @returns The complete greeting message.
 */
export function generateGreeting(name: string = 'Brian Kernighan'): string {
  // Guard clause: Handle missing or blank input strictly to ensure predictable behavior
  if (typeof name !== 'string' || name.trim() === '') {
    return 'Hello, Guest!'
  }

  return `Hello, ${name}!`
}

/**
 * Execution entry point.
 */
function main(): void {
  console.log('🚀 CLI Application is up and running!')
  console.log("Edit src/app.ts and run 'npm start' to see your changes.")

  try {
    const name = parseArgs(process.argv.slice(2))
    const greeting = generateGreeting(name)
    console.log(`\nMessage of the day: ${greeting}`)
  } catch (error) {
    console.error('An unexpected error occurred during execution:', (error as Error).message)
    process.exitCode = 1
  }
}

main()
