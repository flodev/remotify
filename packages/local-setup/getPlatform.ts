export enum OS {
  windows = 'windows',
  linux = 'linux',
  macOS = 'macOS',
  unknown = 'unknown',
}
export const getPlatform = (): OS => {
  switch (process.platform) {
    case 'aix':
      return OS.unknown
    case 'darwin':
      return OS.macOS
    case 'freebsd':
      return OS.unknown
    case 'linux':
      return OS.linux
    case 'openbsd':
      return OS.unknown
    case 'sunos':
      return OS.unknown
    case 'win32':
      return OS.windows
    default:
      return OS.unknown
  }
}
