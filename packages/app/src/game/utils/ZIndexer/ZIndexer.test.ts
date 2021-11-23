import { ZIndexer } from './ZIndexer'

describe('zIndexer', () => {
  test('gets index for height', () => {
    const indexer = new ZIndexer({
      tileHeight: 30,
    })
    expect(indexer.index(75)).toEqual(2)
    expect(indexer.index(10)).toEqual(0)
    expect(indexer.index(60)).toEqual(2)
  })
})
