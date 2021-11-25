export interface JwtDecoded {
  exp: number
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': []
    'x-hasura-default-role': string
    'x-hasura-user-id': string
  }
  iat: number
  name: string
  sub: string
}
