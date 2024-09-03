'use server'

import { revalidateTag } from 'next/cache'

import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  amount: z.number(),
})

type Data = 'Success'

type ErrorCode =
  // 錢包餘額不足
  '1703'

export async function ConsignorWalletWithdrawal(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  formData.append('amount', data.amount.toString())

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    '/frontend/wallets/withdrawal',
    {
      method: 'POST',
      body: formData,
    },
  )

  revalidateTag('wallets')

  return res
}
