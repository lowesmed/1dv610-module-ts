/**
 * Make sure a setting is a positive whole number.
 *
 * @param value - The value to check
 * @param name - Name of the setting, used in the error message
 */
export function validatePositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive whole number`)
  }
}
