import React, { LegacyRef, MutableRefObject, useEffect } from 'react'
import { GAME_CANVAS_ID } from '../../../constants'

interface CanvasProps {
  onReady?(): void
}

export const Canvas = ({ onReady }: CanvasProps) => {
  const desiredWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  )
  const desiredHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  )

  var devicePixelRatio = window.devicePixelRatio || 1

  useEffect(() => {
    onReady && onReady()
    console.log('on ready')
  }, [onReady])

  console.log('render canvas')

  return (
    <canvas
      id={GAME_CANVAS_ID}
      width={desiredWidth * devicePixelRatio}
      height={desiredHeight * devicePixelRatio}
      style={{ width: `100%`, height: `100%` }}
    ></canvas>
  )
}
