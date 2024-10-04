'use server'

import { getToken } from '@/domain/auth/getToken'
import { CookieConfigs } from '@/domain/auth/CookieConfigs'
import { cookies } from 'next/headers'
import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'

type Data = 'Success'

type ErrorCode = never

export async function UpdateConsignorAvatar(formData: FormData) {
  if (!formData.has('avatarPhoto')) {
    throw new Error('field avatarPhoto is required')
  }

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    '/frontend/consignor/avatar',
    {
      method: 'PATCH',
      body: formData,
    },
  )

  const { token } = await getToken({ force: true })
  if (token) {
    cookies().set(CookieConfigs.token.name, token, CookieConfigs.token.opts())
  }

  return res
}
