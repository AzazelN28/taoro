import fs from 'node:fs/promises'
import path from 'node:path'
import { verifyPackageJSON } from './verify.js'

/**
 * Verify that the package.json file is valid.
 *
 * @returns {Promise<void>}
 */
export async function verifyAll(dirName) {
  let totalErrors = 0
  const dir = await fs.opendir(dirName)
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      const numErrors = await verifyPackageJSON(`${dirName}/${dirent.name}/package.json`)
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
  const totalErrors = await verifyAll(process.argv[2] ?? path.resolve(process.cwd(), 'packages'))
  if (totalErrors > 0) {
    console.error(`Found ${totalErrors} errors`)
  } else {
    console.log('All packages are valid')
  }
  process.exit(totalErrors > 0 ? 1 : 0)
}

main()
