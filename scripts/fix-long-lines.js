#!/usr/bin/env node

/**
 * Helper script to automatically fix some common long line patterns
 * This is a temporary solution while we manually fix the remaining long lines
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "fs"
import path from "path"

const FRONTEND_DIR = "frontend/app"
const PATTERNS = [
  // Fix long useState declarations
  {
    pattern: /const \[([^,]+), set\1\] = useState<([^>]+)>\(([^)]+)\)/g,
    replacement: (match, stateName, type, value) => {
      if (match.length > 80) {
        return `const [${stateName}, set${stateName}] = useState<${type}>(\n  ${value}\n)`
      }
      return match
    }
  },

  // Fix long export statements
  {
    pattern: /export \{ ([^}]+) \}/g,
    replacement: (match, exports) => {
      if (match.length > 80) {
        const items = exports.split(", ").map((item) => `  ${item.trim()}`)
        return `export {\n${items.join(",\n")}\n}`
      }
      return match
    }
  },

  // Fix long function parameters
  {
    pattern: /function (\w+)\(\{([^}]+)\}: ([^)]+)\) \{/g,
    replacement: (match, funcName, params, type) => {
      if (match.length > 80) {
        return `function ${funcName}({\n  ${params}\n}: ${type}) {`
      }
      return match
    }
  }
]

function getAllFiles(dir, extensions = [".ts", ".tsx"]) {
  const files = []

  function traverse(currentDir) {
    const items = readdirSync(currentDir)

    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        traverse(fullPath)
      } else if (extensions.some((ext) => item.endsWith(ext))) {
        files.push(fullPath)
      }
    }
  }

  traverse(dir)
  return files
}

function fixLongLines() {
  try {
    const files = getAllFiles(FRONTEND_DIR)

    for (const file of files) {
      const content = readFileSync(file, "utf8")
      let newContent = content

      for (const { pattern, replacement } of PATTERNS) {
        newContent = newContent.replace(pattern, replacement)
      }

      if (newContent !== content) {
        writeFileSync(file, newContent, "utf8")
        console.log(`Fixed long lines in: ${file}`)
      }
    }

    console.log("Long line fixes complete!")
  } catch (error) {
    console.error("Error fixing long lines:", error)
  }
}

fixLongLines()
