import * as core from '@actions/core'
import * as fs from 'fs'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const package_path = core.getInput('package_path')
    const shared = core.getBooleanInput('shared')

    console.debug(`checking whether we can read '${package_path}'`)
    try {
      fs.accessSync(package_path, fs.constants.R_OK)
    } catch (error) {
      throw new Error("can't read package")
    }

    const content = JSON.parse(String(fs.readFileSync(package_path)))
    const hasConfig = Object.prototype.hasOwnProperty.call(content, 'config')
    if (!shared && hasConfig) {
      throw new Error('package was said to not be shared, but it is')
    } else if (shared && !hasConfig) {
      throw new Error('package was said to be shared, but is not')
    }

    const info = shared ? content.config.info : content.info

    core.setOutput('name', info.name)
    core.setOutput('id', info.id)
    core.setOutput('version', info.version)
    core.setOutput('url', info.url)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
