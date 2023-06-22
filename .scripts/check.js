const fs = require('fs')
const path = require('path')

// Source of truth. This file will be used to compare to all bundle files
const truthFile = fs.readFileSync(path.join(__dirname, '../bundle.properties'), 'utf-8')

// Source of truth keys
const truthFileKeys = getKeys(truthFile)// Source of truth keys

// The files to check. Only the pr's changed files will be checked
const filesToCheck = process.argv.slice(2)
  .map(v => fs.readFileSync(v, 'utf-8'))

/**
 * Checks for syntax error
 *
 * @param {string} file
 */
function checkSyntax(file) {
  const lines = file.split('\n')
  let currentLine = 0

  for (const line of lines) {
    currentLine++

    // Ignore empty lines and comments starting with '#'
    if (line.trim() === '' || line.trim().startsWith('#') || line.trim().startsWith('!')) continue

    // Check for invalid syntax
    if (!/^[\w.-]+\s*=\s*.+$/g.test(line)) {
      throw new Error(`Invalid syntax at line ${currentLine}\n  > ${line.trim()}`)
    }
  }
}

/**
 * Check if the file changed has all the necessesary keys that is
 * in the truthFile
 *
 * @param {string} file
 */
function checkKeys(file) {
  const keysToCheck = getKeys(file)

  for (const key of truthFileKeys) {
    if (!keysToCheck.includes(key))
      throw new Error(`Missing key: ${key}`)
  }
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

for (const file of filesToCheck) {
  checkSyntax(file)
  checkKeys(file)
}
