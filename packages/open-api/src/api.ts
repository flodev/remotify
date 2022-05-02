import {
  ApolloClient,
  ApolloError,
  getGameObjectsByRoomId,
  getPlayersOfRoom,
  getRoomByPk,
  subscribeToGameObjectsOfRoom,
  subscribeToPlayersOfRoom,
  subscribeToRoom,
} from '@remotify/graphql'
import {
  Client,
  GameObject,
  GameObjectType,
  Player,
  Room,
  Settings,
  TempSignupType,
  TempSignupResponse,
} from '@remotify/models'
import {
  getClientWithRoomsAndPlayers,
  getGameObjectTypes,
  changePlayerPosition,
  changeGameObject,
  upsertGameObject,
  changeRoom,
  changeRoomTile,
  updatePlayer,
  changeAudioVideoEnabled,
  changePlayerUsername,
  deleteGameObjectById,
  JwtCache,
} from '@remotify/graphql'
import {} from '@remotify/models'
import axios, { AxiosResponse } from 'axios'
import { Subscription } from 'zen-observable-ts'

const JWT_EXPIRED_ERROR_MESSAGE = 'Could not verify JWT: JWTExpired'

type ChangePlayerPositionVars = {
  id: string
  position: { x: number; y: number }
}

type ChangePlayerUsernameVars = { id: string; username: string }
type ChangeAudioVideoEnabledVars = { id: string; is_enabled: boolean }
type UpdatePlayerVars = {
  object: Partial<Player>
  id: string
}
type ChangeRoomTileVars = {
  id: string
  tile: []
}
type ChangeRoomVars = {
  id: string
  object: Partial<Room>
}
type UpsertGameObjectVars = {
  object: Partial<GameObject<any>>
}
type ChangeGameObjectVars = {
  id: string
  object: Partial<GameObject<any>>
}
type DeleteGameObjectByIdVars = {
  id: string
}
type ActivateInteractionVars = {
  playerId: string
  playerAnimation: string
  gameObjectId: string
  gameObjectPlayerId: string
  gameObjectAnimation: string
  gameObjectSettings: Settings
}

export interface ApiInterface {
  getClientWithRoomsAndPlayers(): Promise<Client[]>
  getGameObjectTypes(): Promise<GameObjectType[]>
  changePlayerPosition(variables: ChangePlayerPositionVars): Promise<void>
  changePlayerUsername(variables: ChangePlayerUsernameVars): Promise<void>
  changeAudioVideoEnabled(variables: ChangeAudioVideoEnabledVars): Promise<void>
  updatePlayer(variables: UpdatePlayerVars): Promise<void>
  changeRoomTile(variables: ChangeRoomTileVars): Promise<void>
  changeRoom(variables: ChangeRoomVars): Promise<void>
  upsertGameObject(variables: UpsertGameObjectVars): Promise<void>
  changeGameObject(variables: ChangeGameObjectVars): Promise<void>
  deleteGameObjectById(variables: DeleteGameObjectByIdVars): Promise<void>
  activateInteraction(variables: ActivateInteractionVars): Promise<void>
  listenForGameObjectChange(
    roomId: string,
    onChange: (gameObject: GameObject<Settings>[]) => any
  ): void
  listenForPlayerUpdates(
    roomId: string,
    onChange: (players: Player[]) => any
  ): Subscription
  listenForRoomChange(
    roomId: string,
    onChange: (room: Room) => any
  ): Subscription
}

export const tempSignup = async (
  url: string,
  type: TempSignupType,
  jwtCache: JwtCache,
  inviteId?: string
): Promise<TempSignupResponse> => {
  try {
    const params: { type: TempSignupType; inviteId?: string } = {
      type: type,
    }
    if (inviteId) {
      params.inviteId = inviteId
    }
    // const response = await axios.post('http://192.168.178.72:8081/temp-signup', {
    const response = await axios.post<any, AxiosResponse<TempSignupResponse>>(
      `${url}/auth/temp-signup`,
      params
    )
    if (
      !response.data ||
      !response.data.token ||
      !response.data.refresh_token
    ) {
      throw new Error('invalid signup response')
    }
    jwtCache.set(response.data.token)
    localStorage.setItem('refresh_token', response.data.refresh_token)
    return response.data
  } catch (e) {
    console.error('api error, cannot signup', e)
    throw e
  }
}

export const regainToken = async (url: string, jwtCache: JwtCache) => {
  const response = await axios.post<any, AxiosResponse<TempSignupResponse>>(
    `${url}/auth/refresh-token`,
    {
      refreshToken: localStorage.getItem('refresh_token'),
    }
  )
  jwtCache.set(response.data.token)
}

export class Api implements ApiInterface {
  constructor(
    private authApiUrl: string,
    private apolloClient: ApolloClient<any>,
    private jwtCache: JwtCache
  ) {}

  public async checkIsReady(): Promise<boolean> {
    if (!this.jwtCache.isExpired()) {
      return true
    }
    try {
      await this.refreshToken()
      return true
    } catch (e) {
      console.error('cannot proceed with checkIsReady', e.stack)
      return false
    }
  }

  public async getClientWithRoomsAndPlayers() {
    return this.apiSafeRequest<Client[]>(async () => {
      const { data } = await this.apolloClient.query<{
        client: Array<Client>
      }>({
        query: getClientWithRoomsAndPlayers,
      })
      return data.client
    })
  }
  public async getGameObjectTypes() {
    return this.apiSafeRequest<GameObjectType[]>(async () => {
      const { data } = await this.apolloClient.query<{
        gameobject_type: GameObjectType[]
      }>({
        query: getGameObjectTypes,
      })
      return data.gameobject_type
    })
  }
  public async changePlayerPosition(variables: ChangePlayerPositionVars) {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, ChangePlayerPositionVars>({
        mutation: changePlayerPosition,
        variables,
      })
    })
  }
  public async changePlayerUsername(variables: ChangePlayerUsernameVars) {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, ChangePlayerUsernameVars>({
        mutation: changePlayerUsername,
        variables,
      })
    })
  }
  public async changeAudioVideoEnabled(variables: ChangeAudioVideoEnabledVars) {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, ChangeAudioVideoEnabledVars>({
        mutation: changeAudioVideoEnabled,
        variables,
      })
    })
  }
  public async updatePlayer(variables: UpdatePlayerVars) {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, UpdatePlayerVars>({
        mutation: updatePlayer,
        variables,
      })
    })
  }
  public async changeRoomTile(variables: ChangeRoomTileVars): Promise<void> {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, ChangeRoomTileVars>({
        mutation: changeRoomTile,
        variables,
      })
    })
  }
  public async changeRoom(variables: ChangeRoomVars): Promise<void> {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, ChangeRoomVars>({
        mutation: changeRoom,
        variables,
      })
    })
  }
  public async upsertGameObject(
    variables: UpsertGameObjectVars
  ): Promise<void> {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, UpsertGameObjectVars>({
        mutation: upsertGameObject,
        variables,
      })
    })
  }
  public async changeGameObject(
    variables: ChangeGameObjectVars
  ): Promise<void> {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, ChangeGameObjectVars>({
        mutation: changeGameObject,
        variables,
      })
    })
  }
  public async deleteGameObjectById(
    variables: DeleteGameObjectByIdVars
  ): Promise<void> {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, DeleteGameObjectByIdVars>({
        mutation: deleteGameObjectById,
        variables,
      })
    })
  }
  public async activateInteraction(
    variables: ActivateInteractionVars
  ): Promise<void> {
    return this.apiSafeRequest<void>(async () => {
      await this.apolloClient.mutate<any, ActivateInteractionVars>({
        mutation: deleteGameObjectById,
        variables,
      })
    })
  }
  public listenForGameObjectChange(
    roomId: string,
    onChange: (gameObject: GameObject<Settings>[]) => any
  ): Subscription {
    return this.apolloClient
      .subscribe<{ gameobject: { id: string } }>({
        query: subscribeToGameObjectsOfRoom,
        variables: { room_id: roomId },
      })
      .subscribe(async ({ data }) => {
        console.log('got updated gameobjects', data)
        try {
          const gameObjects = await this.apolloClient.query<{
            gameobject: GameObject<Settings>[]
          }>({
            query: getGameObjectsByRoomId,
            variables: {
              roomId,
            },
            fetchPolicy: 'no-cache',
          })
          if (gameObjects?.data?.gameobject) {
            onChange(gameObjects.data.gameobject)
          }
        } catch (e) {
          console.log('cannot receive game objects by room id', e)
        }
      }, this.handleSubscribeError)
  }

  public listenForPlayerUpdates(
    roomId: string,
    onChange: (players: Player[]) => any
  ): Subscription {
    return this.apolloClient
      .subscribe<{ player: Player[] }>({
        query: subscribeToPlayersOfRoom,
        variables: { roomId },
      })
      .subscribe({
        next: async ({ data }) => {
          console.log('got player updates', data)
          if (data?.player) {
            const players = await this.fetchPlayers(roomId)
            onChange(players)
          }
        },
        error: this.handleSubscribeError,
      })
  }

  public listenForRoomChange(
    roomId: string,
    onChange: (room: Room) => any
  ): Subscription {
    return this.apolloClient
      .subscribe<{ gameobject: { id: string } }>({
        query: subscribeToRoom,
        variables: { roomId },
      })
      .subscribe(async ({ data }) => {
        console.log('room update', data)
        try {
          const room = await this.apolloClient.query<{
            room_by_pk: Room
          }>({
            query: getRoomByPk,
            variables: {
              roomId,
            },
            fetchPolicy: 'no-cache',
          })
          if (room?.data?.room_by_pk) {
            onChange(room.data.room_by_pk)
          }
        } catch (e) {
          console.log('cannot receive game objects by room id', e)
        }
      }, this.handleSubscribeError)
  }

  private async fetchPlayers(roomId: string): Promise<Player[]> {
    try {
      const players = await this.apolloClient.query<{ player: Player[] }>({
        query: getPlayersOfRoom,
        variables: {
          roomId,
        },
        fetchPolicy: 'no-cache',
      })
      console.log('fetch player result', players)
      return players?.data?.player || []
    } catch (e) {
      console.error('error fetching players', e)
      return []
    }
  }

  private errorContainsTokenExpired(apolloError: ApolloError) {
    return !!apolloError.clientErrors.find(
      (error) => error.message === JWT_EXPIRED_ERROR_MESSAGE
    )
  }

  private async refreshToken() {
    await regainToken(this.authApiUrl, this.jwtCache)
  }

  private async apiSafeRequest<T>(apiFunction: () => Promise<T>): Promise<T> {
    try {
      if (!localStorage.getItem('refresh_token')) {
        throw new Error('refresh token not found')
      }
      if (!this.jwtCache || this.jwtCache.isExpired()) {
        await this.refreshToken()
      }
      if (!this.jwtCache || !this.jwtCache.has()) {
        throw new Error('cannot call api')
      }
      return apiFunction()
    } catch (e) {
      const apolloError = e as ApolloError
      console.error('api error', e)
      if (this.errorContainsTokenExpired(apolloError)) {
        await this.refreshToken()
        return apiFunction()
      }
      throw e
    }
  }

  private handleSubscribeError = (error: Error) => {
    if (error.message.indexOf(JWT_EXPIRED_ERROR_MESSAGE) !== -1) {
      this.refreshToken()
    }
    console.error('on error', error)
  }
}
