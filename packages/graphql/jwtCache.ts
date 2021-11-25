import { JwtDecoded } from '@remotify/models'
import jwt_decode from 'jwt-decode'

const SECONDS_BEFORE_UPDATE = 60
export class JwtCache {
  private jwt?: JwtDecoded
  private token?: string
  constructor(token?: string) {
    if (token) {
      this.set(token)
    }
  }
  public set(token: string) {
    this.jwt = jwt_decode<JwtDecoded>(token)
    this.token = token
  }
  public has() {
    return !!this.jwt && !!this.token
  }
  public getDecoded(): JwtDecoded | undefined {
    return this.jwt
  }
  public getToken() {
    return this.token
  }
  public isExpired() {
    return !this.jwt || this.jwt.exp * 1000 <= Date.now()
  }
  public isItTimeToUpdate() {
    if (!this.jwt) {
      console.error('cannot check if its time to update, token not there')
      return false
    }
    return Date.now() > (this.jwt.exp - SECONDS_BEFORE_UPDATE) * 1000
  }
}
