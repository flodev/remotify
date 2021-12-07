import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { EditMode, MenuControls, Webrtc } from '..'
import { SettingsModal } from '../SettingsModal'
import { useStoreContext } from '../../../state'
import { initiateGame } from '../../../game/phaser'
import { useApolloClient } from '@remotify/graphql'

interface ControlsProps {}

export const Controls = observer(({}: ControlsProps) => {
  const storeContext = useStoreContext()
  const {
    gameStore: { game, setGame },
    clientStore: { client },
  } = storeContext

  const apolloClient = useApolloClient()
  useEffect(() => {
    if (!game && !!client) {
      setGame(initiateGame(apolloClient, storeContext))
    }
  }, [game, client])

  return (
    <>
      <EditMode />
      <MenuControls />
      <SettingsModal />
      <Webrtc />
    </>
  )
})
