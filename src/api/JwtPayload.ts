import { CONSIGNOR_STATUS } from '@/domain/static/static-config-mappers'

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
