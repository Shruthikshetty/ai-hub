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
 * function to only let positive int with out decimal
 */
export const handlePositiveIntNoDecimal = (
  e: React.ChangeEvent<HTMLInputElement>,
  fn: (value: number | undefined) => void
) => {
  const val = e.target?.value
  if (val === '') {
    fn(undefined)
    return
  }
  const cleanedVal = val.replace(/\D/g, '')
  fn(cleanedVal === '' ? undefined : Number(cleanedVal))
}

/**
 * function to validated string and set undefined if empty
 */

export const handleStringChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  fn: (value: string | undefined) => void
) => {
  const val = e.target?.value
  fn(val === '' ? undefined : val)
}
