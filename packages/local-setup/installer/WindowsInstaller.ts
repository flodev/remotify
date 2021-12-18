import { Installer } from './Installer'

export class WindowsInstaller implements Installer {
  installDocker(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  installKubectl(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  installMinikube(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  installTilt(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
