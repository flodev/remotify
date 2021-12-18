import { Installer } from './Installer'
import { cpus } from 'os'
import { http, print, system } from 'gluegun'
import path from 'path'
import fs from 'fs'
import { Stream } from 'stream'

export class MacOsInstaller implements Installer {
  async installDocker(): Promise<void> {
    const isIntel = /intel/i.test(cpus()[0].model)
    const localPath = path.resolve(__dirname, 'docker.dmg')
    const writer = fs.createWriteStream(localPath)
    print.spin('Downloading file ... ')
    const api = http.create({
      baseURL: 'https://desktop.docker.com',
      headers: { Accept: 'application/vnd.github.v3+json' },
      responseType: 'stream',
    })
    const response = await api.get<Stream>(
      '/mac/main/amd64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-amd64'
    )
    response.data?.pipe(writer)

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })

    print.spin('Executing file')

    await system.run(`open ${localPath}`)
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
