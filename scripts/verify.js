import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Verify that the package.json file is valid.
 *
 * @returns {Promise<void>}
 */
export async function verifyPackageJSON(fileName) {
  let numErrors = 0
  try {
    const dirName = path.basename(path.dirname(fileName))
    const content = await fs.readFile(fileName, 'utf-8')
    const packageContent = JSON.parse(content)
    if (!packageContent?.name?.startsWith('@taoro/')) {
      console.error(`Package ${packageContent.name} is not valid`)
      numErrors++
    }
    const packageDirName = packageContent?.name?.slice(packageContent?.name?.indexOf('/') + 1)
    if (packageDirName !== dirName) {
      console.error(`Package ${packageContent.name} (${packageDirName}) is in a wrong directory ${dirName}`)
      numErrors++
    }
    if (packageContent?.type !== 'module') {
      console.error(`Package ${packageContent.name} is not a module`)
      numErrors++
    }
    if (packageContent.license !== "MIT") {
      console.error(`Package ${packageContent.name} does not have the proper license`)
      numErrors++
    }
    if (packageContent?.author !== "AzazelN28 <asakon28@gmail.com>") {
      console.error(`Package ${packageContent.name} does not have the proper author`)
      // packageContent.author = "AzazelN28 <asakon28@gmail.com>"
      numErrors++
    }
    if (!packageContent?.files) {
      console.error(
        `Package ${packageContent.name} does not have the proper files exposed`
      )
      // packageContent.files = ['index.js']
      numErrors++
    }
  } catch (error) {
    console.error(error)
    numErrors++
  }
  return numErrors
}
