'use server'

import { cookieConfigs } from '@/app/static'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { getToken } from '../../getToken'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  nickname: z.string(),
})

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
    cookies().set(cookieConfigs.token.name, token, cookieConfigs.token.opts())
  }

  return res
}
