const fs = require('fs')
const path = require('path')

// Source of truth. This file will be used to compare to all bundle files
const truthFile = fs.readFileSync(path.join(__dirname, '../bundle.properties'), 'utf-8')

// Source of truth keys
const truthFileKeys = getKeys(truthFile)// Source of truth keys

// The files to check. Only the pr's changed files will be checked
const filesToCheck = process.argv.slice(2)
  .filter(v => /bundle_[a-z]+\.properties/.test(v))
  .map(v => ({ name: v, data: fs.readFileSync(v, 'utf-8') }))

// Just to track if there is any error
let error = false

/**
 * Checks for syntax error
 *
 * @param {string} file
 */
function checkSyntax(file) {
  let innerError = false

  try {
    const lines = file.data.split('\n')
    let currentLine = 0

    for (const line of lines) {
      currentLine++

      // Ignore empty lines and comments starting with '#'
      if (line.trim() === '' || line.trim().startsWith('#') || line.trim().startsWith('!')) continue

      // Check for invalid syntax
      if (!/^[\w.-]+\s*=\s*.+$/g.test(line)) {
        throw new Error(`Invalid syntax at line ${currentLine} (${file.name})\n  > ${line.trim()}`)
      }
    }
  } catch(err) {
    console.error(err.message)
    error = true
    innerError = true
  }

  return innerError
}

/**
 * Check if the file changed has all the necessesary keys that is
 * in the truthFile
 *
 * @param {string} file
 */
function checkKeys(file) {
  let innerError = false

  try {
    const keysToCheck = getKeys(file.data)
    const missingKeys = []

    for (const key of truthFileKeys) {
      if (!keysToCheck.includes(key))
        missingKeys.push(key)
    }

    if (missingKeys.length > 0)
      throw new Error(`Missing keys (${file.name}):\n${missingKeys.map(v => `  • ${v}`).join('\n')}`)
  } catch(err) {
    console.error(err.message)
    error = true
    innerError = true
  }

  return innerError
}

/**
 * Utility function for getting the keys in a file
 *
 * @param {string} file
 * @returns {string[]}
 */
function getKeys(file) {
  return file.split('\n')
    .filter(v => v.trim() !== '' && !v.trim().startsWith('#'))
    .map(v => v.split('=')[0].trim())
}

// Check all the files
for (const file of filesToCheck) {
  const syntaxErr = checkSyntax(file)
  const keysErr = checkKeys(file)

  if (syntaxErr || keysErr) {
    console.log()
  }
}

// Exit with an error if there is one
if (error) {
  process.exit(1)
}
