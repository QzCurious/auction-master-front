'use server'

import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'
import { apiClient } from './apiClient'
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
  | '1028'
  // invalid account format
  | '1032'

export async function CreateConsignor(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClient<Data, ErrorCode>('/consignor', {
    method: 'POST',
    body: urlencoded,
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
