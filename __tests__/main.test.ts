/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the GitHub Actions core library
const getInputMock = jest.spyOn(core, 'getInput')
const getBooleanInputMock = jest.spyOn(core, 'getBooleanInput')
const setFailedMock = jest.spyOn(core, 'setFailed')
const setOutputMock = jest.spyOn(core, 'setOutput')

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('properly returns information from regular package', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'package_path':
          return 'qpm.json'
        default:
          return ''
      }
    })

    getBooleanInputMock.mockImplementation((name: string): boolean => {
      switch (name) {
        case 'shared':
          return false
        default:
          return false
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).not.toHaveBeenCalled()

    // verify outputs to have worked
    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'name', 'FakePackage')

    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'id', 'fakepackage')

    expect(setOutputMock).toHaveBeenNthCalledWith(3, 'version', '1.0.0')

    expect(setOutputMock).toHaveBeenNthCalledWith(
      4,
      'url',
      'https://github.com/RedBrumbler/qpm-info'
    )
  })

  it('properly returns information from shared package', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'package_path':
          return 'qpm.shared.json'
        default:
          return ''
      }
    })

    getBooleanInputMock.mockImplementation((name: string): boolean => {
      switch (name) {
        case 'shared':
          return true
        default:
          return false
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).not.toHaveBeenCalled()

    // verify outputs to have worked
    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'name', 'FakePackage')

    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'id', 'fakepackage')

    expect(setOutputMock).toHaveBeenNthCalledWith(3, 'version', '1.0.0')

    expect(setOutputMock).toHaveBeenNthCalledWith(
      4,
      'url',
      'https://github.com/RedBrumbler/qpm-info'
    )
  })

  it('fails to read invalid path', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'package_path':
          return 'this path does not exist'
        default:
          return ''
      }
    })

    getBooleanInputMock.mockImplementation((name: string): boolean => {
      switch (name) {
        default:
          return false
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(1, "can't read package")
  })

  it('fails to read a regular package as shared', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'package_path':
          return 'qpm.json'
        default:
          return ''
      }
    })

    getBooleanInputMock.mockImplementation((name: string): boolean => {
      switch (name) {
        case 'shared':
          return true
        default:
          return false
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'package was said to be shared, but is not'
    )
  })

  it('fails to read a shared package as regular', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'package_path':
          return 'qpm.shared.json'
        default:
          return ''
      }
    })

    getBooleanInputMock.mockImplementation((name: string): boolean => {
      switch (name) {
        case 'shared':
          return false
        default:
          return false
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'package was said to not be shared, but it is'
    )
  })
})
