'use server'

import { cookieConfigs } from '@/app/static'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { getToken } from '../../getToken'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  nickname: z.string(),
})

type Data = 'Success'

type ErrorCode = never

export async function UpdateConsignor(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  formData.append('nickname', data.nickname)

  const res = await withAuth(apiClient)<Data, ErrorCode>('/frontend/consignor', {
    method: 'PATCH',
    body: formData,
  })

  const { token } = await getToken({ force: true })
  if (token) {
    cookies().set(cookieConfigs.token.name, token, cookieConfigs.token.opts)
  }
  revalidateTag('consignor')

  return res
}
