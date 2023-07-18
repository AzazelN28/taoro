import fs from 'node:fs/promises'

/**
 * Verify that the package.json file is valid.
 *
 * @returns {Promise<void>}
 */
export async function fixPackageJSON(fileName, { dryRun = true } = {}) {
  let numErrors = 0
  try {
    const content = await fs.readFile(fileName, 'utf-8')
    const packageContent = JSON.parse(content)
    if (!packageContent?.name?.startsWith('@taoro/')) {
      packageContent.name = `@taoro/${packageContent.name}`
    }
    if (packageContent?.type !== 'module') {
      packageContent.type = 'module'
    }
    if (packageContent?.author !== 'AzazelN28 <asakon28@gmail.com>') {
      packageContent.author = 'AzazelN28 <asakon28@gmail.com>'
    }
    if (packageContent?.license !== 'MIT') {
      packageContent.license = 'MIT'
    }
    if (packageContent?.keywords?.length === 0) {
      packageContent.keywords = ['taoro']
    }
    if (!packageContent?.repository) {
      packageContent.repository = {
        type: 'git',
        url: 'https://github.com/AzazelN28/taoro.git',
        directory: `packages/${packageContent.name.slice(packageContent.name.indexOf('/') + 1)}`,
      }
    } else {
      if (packageContent.repository.url === 'https://github.com/anaga/taoro.git') {
        packageContent.repository.url = 'https://github.com/AzazelN28/taoro.git'
      }
    }
    if (!packageContent?.files) {
      packageContent.files = ['index.js']
    }
    if (dryRun) {
      console.log(JSON.stringify(packageContent, null, 2))
      return numErrors
    }
    await fs.writeFile(fileName, JSON.stringify(packageContent, null, 2), 'utf-8')
  } catch (error) {
    console.error(error)
    numErrors++
  }
  return numErrors
}
