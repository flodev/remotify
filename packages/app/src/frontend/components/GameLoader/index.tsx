import { FunctionComponent, useContext, useEffect, useState } from 'react'
import { ApiContext } from '../../context'
import { Canvas, Controls, FullPageLoader } from '..'
import { StoreContextProvider } from '../../../state'
import { message } from 'antd'
import { cleanLocalStorage } from '../../utils'

// Set the name of the hidden property and the change event for visibility
let visibilityChange:
  | 'visibilitychange'
  | 'msvisibilitychange'
  | 'webkitvisibilitychange'
let hidden: 'hidden' | 'msHidden' | 'webkitHidden'
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
  // @ts-ignore
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
  // @ts-ignore
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}

interface GameProps {}

export const GameLoader: FunctionComponent<GameProps> = () => {
  const [isCanvasReady, setIsCanvasReady] = useState(false)
  const { api } = useContext(ApiContext)

  // useEffect(() => {
  // document.addEventListener(visibilityChange, () => {
  //   // @ts-ignore
  //   if (document[hidden]) {
  //   } else {
  //   }
  // })
  // }, [player])

  useEffect(() => {
    if (!localStorage.getItem('roomId')) {
      message.error('Invalid local data. I will clear your cache and reload')
      cleanLocalStorage()
      window.location.href = '/'
    }
  }, [])

  if (!localStorage.getItem('roomId')) {
    return <FullPageLoader />
  }

  return (
    <StoreContextProvider
      roomId={localStorage.getItem('roomId')!}
      userId={localStorage.getItem('userId')!}
      api={api}
    >
      {isCanvasReady && <Controls />}
      <Canvas onReady={() => setIsCanvasReady(true)} />
    </StoreContextProvider>
  )
}
