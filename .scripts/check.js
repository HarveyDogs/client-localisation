const fs = require('fs')
const path = require('path')

// Source of truth. This file will be used to compare to all bundle files
const truthFile = fs.readFileSync(path.join(__dirname, '../bundle.properties'), 'utf-8')

// The files to check. Only the pr's changed files will be checked
const filesToCheck = process.argv.slice(2)
  .map(v => fs.readFileSync(v, 'utf-8'))

console.log(filesToCheck)

/**
 * Checks for syntax error
 * @param {string} file
 */
function checkSyntax(file) {
  try {
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
  } catch(err) {
    console.error(`Error: ${err.message}`)
  }
}

checkSyntax(truthFile)
