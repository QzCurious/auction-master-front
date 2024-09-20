import { getToken } from '@/domain/auth/getToken'
import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from '../JwtPayload'

export async function getUser() {
  const { token, res } = await getToken()
  const jwt = token ? jwtDecode<JwtPayload>(token) : null

  return jwt
    ? {
        id: jwt.id,
        avatar: jwt.avatar,
        account: jwt.account,
        nickname: jwt.nickname,
        status: jwt.status,
      }
    : null
}
