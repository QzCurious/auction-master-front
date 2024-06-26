import { CONSIGNOR_STATUS_DATA } from './frontend/configs.data'

export interface JwtPayload {
  id: number
  avatar: string
  account: string
  nickname: string
  status: (typeof CONSIGNOR_STATUS_DATA)[number]['value']
  exp: number
  iat: number
  nbf: number
}
