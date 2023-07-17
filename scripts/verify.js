import fs from 'node:fs/promises'

/**
 * Verify that the package.json file is valid.
 *
 * @returns {Promise<void>}
 */
export async function verifyPackageJSON(fileName) {
  let numErrors = 0
  try {
    const content = await fs.readFile(fileName, 'utf-8')
    const packageContent = JSON.parse(content)
    if (!packageContent?.name?.startsWith('@taoro/')) {
      console.error(`Package ${packageContent.name} is not valid`)
      numErrors++
    }
    if (packageContent?.type !== 'module') {
      console.error(`Package ${packageContent.name} is not a module`)
      numErrors++
    }
  } catch (error) {
    console.error(error)
    numErrors++
  }
  return numErrors
}
