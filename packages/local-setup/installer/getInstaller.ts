import { OS } from '../getPlatform'
import { Installer } from './Installer'
import { LinuxInstaller } from './LinuxInstaller'
import { MacOsInstaller } from './MacOsInstaller'
import { WindowsInstaller } from './WindowsInstaller'

export const getInstaller = (os: OS): Installer => {
  switch (os) {
    case OS.macOS:
      return new MacOsInstaller()
    case OS.linux:
      return new LinuxInstaller()
    case OS.windows:
      return new WindowsInstaller()
    default:
      throw new Error('unknown OS')
  }
}
