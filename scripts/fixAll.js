import fs from 'node:fs/promises'
import path from 'node:path'
import { fixPackageJSON } from './fix.js'

/**
 * Verify that the package.json file is valid.
 *
 * @returns {Promise<void>}
 */
export async function fixAll(dirName, { dryRun = false } = {}) {
  let totalErrors = 0
  const dir = await fs.opendir(dirName)
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      const numErrors = await fixPackageJSON(`${dirName}/${dirent.name}/package.json`, { dryRun })
      if (numErrors > 0) {
        totalErrors += numErrors
        console.error(`Package ${dirent.name} has errors`)
      }
    }
  }
  return totalErrors
}

/**
 * Main function.
 */
async function main() {
  const totalErrors = await fixAll(process.argv[2] ?? path.resolve(process.cwd(), 'packages'), {
    dryRun: process.argv.slice(2).includes('--dry')
  })
  if (totalErrors > 0) {
    console.error(`Found ${totalErrors} errors`)
  } else {
    console.log('All packages are valid')
  }
  process.exit(totalErrors > 0 ? 1 : 0)
}

main()
