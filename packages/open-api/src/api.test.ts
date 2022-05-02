import { Api } from './api'
import jsonServer from 'json-server'
import { JwtCache } from '@remotify/graphql'
import cors from 'cors'
import { Application } from 'express'
const middlewares = jsonServer.defaults({ noCors: true })
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDE5MzU5NDgsImV4cCI6MTY0NDUyNzk0OCwic3ViIjoiZmVkMWZkNzAtNTVmNy00YjRkLWEwN2UtODkxODE0YzQyODVjIiwianRpIjoiNTYwMTFmNzgtNjhjNi00YTk0LWI5YzgtZTRkYmRlMzljMjg5In0.UNfTEZCD2p3DW5V6ylh6PRXa4AceJXIu_a0zIT9wEKl7ByC_BIjIlCquqNAdygptc5q8E2jtFUoOBkhU2GtK2TpdMSe699HCIP1BbKOtLUtMm5iYDOcRXksPLg9n2BOtWAwx-IDdHOHV6pAP0WgRsKtWHB01cZTSAIlIJsJfaGiooNpTSUuwpSCBsPP4dASOaGbiuxky-puzzLk3aH8R5exvvGRfiTgn4fC7NtcqCPHpvy8roC42Swq5kLcvrTy1LlaaUOUHGn57zWZ05dKE48J3da7ui7h1IqzIdpwyurrffelWRYabmZkNnwHm1ME2jot9i8rMQhxZ2t6_Y9-7TF_njeeZsjMaNPGnXV7iT7nvmDrr1oxWgM47GzEymJqkf0-RKDRwRIeMgQl0njHKEGhBogrYua3JDUYnwVywlcu_QnF1yi4tSpdplTEoDbp2cog8PiQPSNM1TxIWEpnUyL-2n8eclYcUrIrvMj6WdNNY_6mVEHxIBfcUaCV51ytJvWO_7lrWC7NLMO3GHdvm2UOJzwMUo7qa-OfXD0-vGwJUduU7KZpuP970Ry0MftflzBngCEa09xR5HOjA6oQh5CWb_2e3NV1CI5BOoGf6Jz64YCHs9wKuGllOwo8PBobYarzKlsdsVaKcPOJ7RAVbhmZ03M2-DyOM5n8Ep8aVqyk'

describe('api test', () => {
  let httpServer: any
  let server: Application
  beforeEach((done) => {
    server = jsonServer.create()
    server.use(
      cors({
        origin: true,
        credentials: true,
        preflightContinue: false,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      })
    )
    server.use(middlewares)
    httpServer = server.listen(65534, () => {
      console.log('JSON Server is running')
      done()
    })
  })

  afterEach((done) => {
    httpServer.close(done)
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('gets token from api', async () => {
    server.post('/auth/refresh-token', (req, res) => {
      res.json({
        token,
        refresh_token: token,
      })
    })
    const api = new Api('http://localhost:65534', {} as any, new JwtCache())
    const isReady = await api.checkIsReady()
    expect(isReady).toBeTruthy()
  })

  it('gets token from jwt cache', async () => {
    server.post('/auth/refresh-token', () => {
      throw new Error()
    })
    const jwtCache = new JwtCache()
    const isExpired = jest.spyOn(jwtCache, 'isExpired').mockReturnValue(false)
    const api = new Api('http://localhost:65534', {} as any, jwtCache)
    const isReady = await api.checkIsReady()
    expect(isReady).toBeTruthy()
    expect(isExpired).toBeCalled()
  })

  it('should only make one refresh-token request at a time', async () => {
    let timesCalled = 0
    server.post('/auth/refresh-token', (req, res) => {
      timesCalled++
      res.json({
        token,
        refresh_token: token,
      })
    })
    const jwtCache = new JwtCache()
    const isExpired = jest.spyOn(jwtCache, 'isExpired').mockReturnValue(true)
    const api = new Api('http://localhost:65534', {} as any, jwtCache)
    await Promise.all([api.checkIsReady(), api.checkIsReady()])

    expect(timesCalled).toEqual(1)
  })
})
