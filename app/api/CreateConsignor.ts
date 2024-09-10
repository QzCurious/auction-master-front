'use server'

import { apiClient } from '@/app/api/apiClient'
import { z } from 'zod'
import { appendEntries } from '../static'
import { ConsignorLogin } from './ConsignorLogin'
import { throwIfInvalid } from './helpers/throwIfInvalid'

const ReqSchema = z.object({
  account: z.string(),
  password: z.string(),
  nickname: z.string(),
})

type Data = 'Success'

type ErrorCode =
  // consignor account exists
  '1028'

export async function CreateConsignor(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  appendEntries(formData, data)

  const res = await apiClient<Data, ErrorCode>('/consignor', {
    method: 'POST',
    body: formData,
  })

  if (!res.error) {
    const res = await ConsignorLogin({
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
