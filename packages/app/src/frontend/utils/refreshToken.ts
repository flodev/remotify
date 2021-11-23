import { AxiosInstance } from 'axios'
import jwt_decode from 'jwt-decode'
import { JwtDecoded } from '@remotify/models'

let intervalId: any

// export const refreshToken = (axios: AxiosInstance) => {
//   intervalId = setInterval(async () => {
//     if (!localStorage.getItem('refresh_token')) {
//       return console.error('cannot find refresh token')
//     }
//     if (JwtCache.has() && JwtCache.isExpired()) {
//       const response = await getRefreshToken(axios)
//       if (response?.data?.token) {
//         const decoded = jwt_decode<JwtDecoded>(response.data.token)
//         JwtCache.set(decoded)
//       }
//     }
//   }, 60 * 1000)

//   return stop
// }

// export const getRefreshToken = (axios: AxiosInstance) => {
//   return axios.post(`${process.env.AUTH_API_URL}/auth/refresh_token`, {
//     refreshToken: localStorage.getItem('refresh_token'),
//   })
// }

// export const stop = () => {
//   clearInterval(intervalId)
// }
