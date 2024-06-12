'use server'

import { apiClient } from '@/app/api/apiClient'
import { z } from 'zod'
import { throwIfInvalid } from './helpers/throwIfInvalid'
import { session } from './session'

const ReqSchema = z.object({
  account: z.string(),
  password: z.string(),
  nickname: z.string(),
})

type Data = 'Success'

type ErrorCode =
  // ConsignorExisted
  '1601'

export async function consignor(payload: z.input<typeof ReqSchema>) {
  throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  formData.append('account', payload.account)
  formData.append('password', payload.password)
  formData.append('nickname', payload.nickname)

  const res = await apiClient<Data, ErrorCode>('/consignor', {
    method: 'POST',
    body: formData,
  })

  if (!res.error) {
    const res = await session({
      account: payload.account,
      password: payload.password,
    })
    if (res.error) {
      throw new Error('Backend bug')
    }
    return res
  }

  return res
}
