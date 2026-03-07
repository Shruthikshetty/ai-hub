/**
 * function to validated number and set undefined if empty
 */

export const handleNumberChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  fn: (value: number | undefined) => void
) => {
  const val = e.target?.value
  fn(val === '' ? undefined : Number(val))
}

/**
 * function to validated string and set undefined if empty
 */

export const handleStringChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  fn: (value: string | undefined) => void
) => {
  const val = e.target?.value
  fn(val === '' ? undefined : val)
}
