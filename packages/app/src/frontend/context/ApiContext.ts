import React from 'react'
import { Api } from '@remotify/open-api'
import { EditToolType } from '../../game/editTools'

interface GameStateContextType {
  api: Api
}

export const ApiContext = React.createContext<GameStateContextType>({
  api: {} as Api,
})
