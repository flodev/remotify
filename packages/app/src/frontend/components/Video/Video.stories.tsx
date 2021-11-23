import React, { ElementRef, useEffect, useRef, useState } from 'react'
import { Video } from './Video'

export default {
  title: 'Video',
}

export const Default = () => {
  const ref = useRef<ElementRef<typeof Video> | null>(null)
  const [visible, setVisible] = useState<boolean>(false)
  useEffect(() => {
    ;(async function () {
      try {
        // @ts-ignore
        // await ref?.current?.requestVideo()
        setVisible(true)
      } catch (e) {
        console.log('error requesting video', e)
      }
    })()
  }, [ref])
  return <Video ref={ref} />
}
