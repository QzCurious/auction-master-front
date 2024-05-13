'use server'

import { jwtDecode } from 'jwt-decode'
import { z } from 'zod'
import { ApiErrorStatus, apiClient } from '../api/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ReqSchema = z.object({
  account: z.string(),
  password: z.string(),
})

type ApiError = ApiErrorStatus<{
  code: '1002'
  message: 'account or password incorrect'
}>

interface ApiData {
  token: string
  refreshToken: string
}

export async function login(formData: FormData) {
  const parsed = ReqSchema.safeParse(Object.fromEntries(formData))
  if (parsed.error) {
    const err = parsed.error.flatten()
    return { data: null, error: err } as const
  }

  const data = await apiClient<ApiData, ApiError>('/session', {
    method: 'POST',
    body: formData,
  })

  if (data.error) {
    if (data.error.code === '1002') {
      return {
        data: null,
        error: new z.ZodError([
          {
            code: 'custom',
            path: [],
            message: 'account or password incorrect',
          },
        ]).flatten(),
      } as const
    }

    throw new Error(
      process.env.NODE_ENV === 'development' ? data.error.message : data.error.code,
    )
  }

  const jwt = jwtDecode<{
    id: number
    account: string
    status: 11
    exp: number
    iat: number
    nbf: number
  }>(data.data.token)

  cookies().set('token', data.data.token, {
    expires: new Date(jwt.exp * 1000),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  cookies().set('refreshToken', data.data.refreshToken, {
    expires: new Date(jwt.exp * 1000),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  cookies().set('account', jwt.account, {
    expires: new Date(jwt.exp * 1000),
    sameSite: 'strict',
  })

  redirect('/')
  // return { data: data.data, error: null }
}
