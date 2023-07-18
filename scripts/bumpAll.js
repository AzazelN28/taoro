import fs from 'node:fs/promises'
import path from 'node:path'
import { bumpPackageJSON } from './bump.js'

/**
 * Verify that the package.json file is valid.
 *
 * @returns {Promise<void>}
 */
export async function bumpAll(dirName, { dryRun = false, version = 'patch' } = {}) {
  let totalErrors = 0
  const dir = await fs.opendir(dirName)
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      const numErrors = await bumpPackageJSON(
        `${dirName}/${dirent.name}/package.json`,
        { dryRun, version }
      )
      if (numErrors > 0) {
        totalErrors += numErrors
        console.error(`Package ${dirent.name} has errors`)
      }
    }
  }
  return totalErrors
}

/**
 * Get the version to bump from the command line arguments.
 *
 * @param {*} argv
 * @returns
 */
function getVersionFromArgv(argv) {
  if (argv.includes('--major')) {
    return 'major'
  } else if (argv.includes('--minor')) {
    return 'minor'
  } else {
    return 'patch'
  }
}

/**
 * Main function.
 */
async function main() {
  const totalErrors = await bumpAll(
    process.argv[2] ?? path.resolve(process.cwd(), 'packages'),
    {
      dryRun: process.argv.slice(2).includes('--dry'),
      version: getVersionFromArgv(process.argv.slice(2))
    }
  )
  if (totalErrors > 0) {
    console.error(`Found ${totalErrors} errors`)
  } else {
    console.log('All packages were bumped')
  }
  process.exit(totalErrors > 0 ? 1 : 0)
}

main()
