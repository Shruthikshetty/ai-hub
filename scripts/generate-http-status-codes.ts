import { writeFile } from 'fs/promises'
import path from 'path'

const CODES_URL =
  'https://raw.githubusercontent.com/prettymuchbryce/http-status-codes/refs/heads/master/codes.json'
const OUTPUT_FILE = path.join(
  process.cwd(),
  'src',
  'main',
  'constants',
  'http-status-codes.constants.ts'
)

// This regex pattern is used to check for valid variable names
// It allows letters, numbers, underscores, and dollar signs
// It ensures the name doesn't start with a number
const VALID_VARIABLE_NAME_REGEX = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/

interface StatusCode {
  code: number
  phrase: string
  constant: string
  comment: {
    doc: string
    description: string
  }
}

const fetchCodes = async () => {
  const response = await fetch(CODES_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch codes: ${response.statusText}`)
  }
  return response.json() as Promise<StatusCode[]>
}

const generateFileContent = (codes: StatusCode[]) => {
  const lines = [
    '// Generated file. Do not edit',
    `// Codes retrieved on ${new Date().toUTCString()} from ${CODES_URL}`
  ]

  codes.forEach(({ code, constant, comment }) => {
    if (!VALID_VARIABLE_NAME_REGEX.test(constant)) {
      console.warn(`Skipping invalid constant name: ${constant}`)
      return
    }

    lines.push(`/**`)
    lines.push(` * ${comment.doc}`)
    lines.push(` *`)
    lines.push(` * ${comment.description}`)
    lines.push(` */`)
    lines.push(`export const ${constant} = ${code}`)
  })

  return lines.join('\n')
}

const main = async () => {
  try {
    console.log('Fetching status codes...')
    const codes = await fetchCodes()
    console.log(`Fetched ${codes.length} codes.`)

    console.log('Generating file content...')
    const content = generateFileContent(codes)

    console.log(`Writing to ${OUTPUT_FILE}...`)
    await writeFile(OUTPUT_FILE, content)

    console.log('Done!')
  } catch (error) {
    console.error('Error generating status codes:', error)
    process.exit(1)
  }
}

main()
