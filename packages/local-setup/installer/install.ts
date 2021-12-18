import { prompt } from 'gluegun'
import { OS } from '../getPlatform'
import { getInstaller } from './getInstaller'

export const install = async (platform: OS) => {
  const installer = getInstaller(platform)

  const shouldInstallDocker = await prompt.confirm('install docker?')
  if (shouldInstallDocker) {
    await installer.installDocker()
  }
  const shouldInstallKubectl = await prompt.confirm('install Kubectl?')
  if (shouldInstallKubectl) {
    await installer.installKubectl()
  }
  const shouldInstallMinikube = await prompt.confirm('install Minikube?')
  if (shouldInstallMinikube) {
    await installer.installMinikube()
  }
  const shouldInstallTilt = await prompt.confirm('install Tilt?')
  if (shouldInstallTilt) {
    await installer.installTilt()
  }
}
