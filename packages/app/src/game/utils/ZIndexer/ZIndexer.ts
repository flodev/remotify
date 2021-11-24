type Config = {
  tileHeight: number
}

export class ZIndexer {
  constructor(private config: Config) {}
  public index(y: number): number {
    return Math.floor(y / this.config.tileHeight)
  }
}
