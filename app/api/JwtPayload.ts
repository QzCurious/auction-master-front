import { CONSIGNOR_STATUS } from './frontend/GetFrontendConfigs.data'

export interface JwtPayload {
  id: number
  avatar: string
  account: string
  nickname: string
  status: CONSIGNOR_STATUS['value']
  exp: number
  iat: number
  nbf: number
}
