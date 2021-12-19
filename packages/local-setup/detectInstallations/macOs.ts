import { detectInstallations, Installations } from './detectInstallations'
import { lookpath } from 'lookpath'

export const macOs: detectInstallations = async () => {
  const [hasDocker, hasKubectl, hasMinikube, hasTilt] = await Promise.all([
    lookpath('docker'),
    lookpath('kubectl'),
    lookpath('minikube'),
    lookpath('tilt'),
  ])

  return {
    hasDocker: !!hasDocker,
    hasKubectl: !!hasKubectl,
    hasMinikube: !!hasMinikube,
    hasTilt: !!hasTilt,
  }
}
