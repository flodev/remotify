import React from 'react'
import {
  ClientStore,
  GameObjectStore,
  GameStore,
  PlayerStore,
  RoomStore,
  StoreContext,
  Stores,
  UserMediaStore,
} from '../../src/state'
import { Mock } from 'moq.ts'

const defaultStoresMock = new Mock<Stores>().object()

export const StoreContextMock = (props: {
  children: React.ReactNode
  stores?: Stores
}) => {
  return (
    <StoreContext.Provider value={props.stores || defaultStoresMock}>
      {props.children}
    </StoreContext.Provider>
  )
}
