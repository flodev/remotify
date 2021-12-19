import { prompt, print } from 'gluegun'
import { detectInstallations } from '../detectInstallations'
import { OS } from '../getPlatform'
import { getInstaller } from './getInstaller'

const printDetectionInfo = (app: string, exists: boolean) => {
  print.info(`${app} ${exists ? '✅' : '❌'}`)
}

const confirmAndInstall = async (
  exists: boolean,
  app: string,
  callback: () => Promise<void>
) => {
  if (exists) {
    print.info('skipping installation because it already exists')
    return Promise.resolve()
  }
  const shouldInstall = await prompt.confirm(`install ${app}?`)
  if (shouldInstall) {
    return callback()
  }
}

export const install = async (platform: OS) => {
  const installer = getInstaller(platform)
  const { hasDocker, hasKubectl, hasMinikube, hasTilt } =
    await detectInstallations(platform)

  printDetectionInfo('docker', hasDocker)
  printDetectionInfo('kubectl', hasKubectl)
  printDetectionInfo('minikube', hasMinikube)
  printDetectionInfo('tilt', hasTilt)

  if (hasDocker && hasKubectl && hasMinikube && hasTilt) {
    print.info(
      'Your system seems ready. Everything needed is installed. Thanks in advance for your support 💙💙💙'
    )
    return
  }

  await confirmAndInstall(hasDocker, 'docker', () => installer.installDocker())
  await confirmAndInstall(hasDocker, 'kubectl', () =>
    installer.installKubectl()
  )
  await confirmAndInstall(hasDocker, 'minikube', () =>
    installer.installMinikube()
  )
  await confirmAndInstall(hasDocker, 'tilt', () => installer.installTilt())

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
