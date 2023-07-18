import fs from 'node:fs/promises'

/**
 * Verify that the package.json file is valid.
 *
 * @returns {Promise<void>}
 */
export async function bumpPackageJSON(fileName, { dryRun = true, version = 'patch' } = {}) {
  let numErrors = 0
  try {
    const content = await fs.readFile(fileName, 'utf-8')
    const packageContent = JSON.parse(content)
    const [major, minor, patch] = packageContent.version.split('.')
    if (version === 'major') {
      packageContent.version = `${parseInt(major) + 1}.${minor}.${patch}`
    } else if (version === 'minor') {
      packageContent.version = `${major}.${parseInt(minor) + 1}.${patch}`
    } else {
      packageContent.version = `${major}.${minor}.${parseInt(patch) + 1}`
    }
    if (dryRun) {
      console.log(JSON.stringify(packageContent, null, 2))
      return numErrors
    }
    await fs.writeFile(
      fileName,
      JSON.stringify(packageContent, null, 2),
      'utf-8'
    )
  } catch (error) {
    console.error(error)
    numErrors++
  }
  return numErrors
}
