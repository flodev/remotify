export const getUserMediaConstraints = (): MediaStreamConstraints => {
  return {
    video: {
      width: { max: 320 },
      height: { max: 320 },
      aspectRatio: 16 / 9,
      facingMode: 'user',
    },
    audio: true,
  }
}
