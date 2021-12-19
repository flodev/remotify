import { OS } from '../getPlatform'
import { Installations } from './detectInstallations'
import { linux } from './linux'
import { macOs } from './macOs'
import { windows } from './windows'

export const detectInstallations = (platform: OS): Promise<Installations> => {
  switch (platform) {
    case OS.macOS:
      return macOs()
    case OS.linux:
      return linux()
    case OS.windows:
      return windows()
  }
}
