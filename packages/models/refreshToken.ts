export interface RefreshToken {
  id?: string
  user_id: string
  is_revoked: boolean
  expired_at: string
}
