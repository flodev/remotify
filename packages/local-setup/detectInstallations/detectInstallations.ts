export type Installations = {
  hasDocker: boolean
  hasKubectl: boolean
  hasMinikube: boolean
  hasTilt: boolean
}

export type detectInstallations = () => Promise<Installations>
