export const cleanLocalStorage = () => {
  localStorage.removeItem('userId')
  localStorage.removeItem('roomId')
  localStorage.removeItem('userName')
  localStorage.removeItem('roomName')
  localStorage.removeItem('refresh_token')
}
