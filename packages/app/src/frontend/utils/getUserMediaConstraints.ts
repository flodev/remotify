export const getUserMediaConstraints = (): MediaStreamConstraints => {
  return {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      aspectRatio: 16 / 9,
    },
    // audio: true,
  }
}
