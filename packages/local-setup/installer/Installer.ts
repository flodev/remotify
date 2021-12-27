/**
 * The Builder interface specifies methods for creating the different parts of
 * the Product objects.
 */
export interface Installer {
  installDocker(): Promise<void>
  installKubectl(): Promise<void>
  installMinikube(): Promise<void>
  installHelm(): Promise<void>
  installTilt(): Promise<void>
}
