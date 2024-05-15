import { apiClient } from '@/app/api/client'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { z } from 'zod'

const ReqSchema = z.object({
  account: z.string(),
  password: z.string(),
})

type ErrorCode =
  // PasswordIncorrect
  | '1004'
  // ConsignorNotExist
  | '1602'

interface ApiData {
  token: string
  refreshToken: string
}

export async function session(formData: FormData) {
  const parsed = ReqSchema.safeParse(Object.fromEntries(formData))
  if (parsed.error) {
    const err = parsed.error.flatten()
    return { data: null, error: null, parseError: err }
  }

  const res = await apiClient<ApiData, ErrorCode>('/session', {
    method: 'POST',
    body: formData,
  })

  if (res.error) {
    return { data: null, error: res.error, parseError: null }
  }

  const jwt = jwtDecode<{
    id: number
    account: string
    status: 11
    exp: number
    iat: number
    nbf: number
  }>(res.data.token)

  cookies().set('token', res.data.token, {
    expires: new Date(jwt.exp * 1000),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  cookies().set('refreshToken', res.data.refreshToken, {
    expires: new Date(jwt.exp * 1000),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  cookies().set('account', jwt.account, {
    expires: new Date(jwt.exp * 1000),
    sameSite: 'strict',
  })

  return { data: res.data, error: null, parseError: null }
}
