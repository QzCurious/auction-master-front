'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  nickname: z.string(),
})

type Data = 'Success'

type ErrorCode = never

export async function updateConsignor(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  formData.append('nickname', data.nickname)

  const res = await withAuth(apiClient)<Data, ErrorCode>('/frontend/consignor', {
    method: 'PATCH',
    body: formData,
  })

  revalidateTag('consignor')

  return res
}
