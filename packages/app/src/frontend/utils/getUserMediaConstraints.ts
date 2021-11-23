export const getUserMediaConstraints = (): MediaStreamConstraints => {
  return {
    video: { width: { exact: 1280 }, height: { exact: 720 } },
    // audio: true,
  }
}
