'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  name: z.string().min(1),
  identification: z.string().min(1),
  phone: z.string().min(1),
  bankCode: z.string().min(1),
  bankAccount: z.string().min(1),
})

type Data = 'Success'

// 1005: name incorrect, 1006: identification incorrect
type ErrorCode = '1005' | '1006'

export async function UpdateConsignorVerification(formData: FormData) {
  const payload = {
    name: formData.get('name'),
    identification: formData.get('identification'),
    phone: formData.get('phone'),
    bankCode: formData.get('bankCode'),
    bankAccount: formData.get('bankAccount'),
  }
  throwIfInvalid(payload as any, ReqSchema)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    '/frontend/consignor/verifications',
    {
      method: 'PATCH',
      body: formData,
    },
  )

  revalidateTag('consignor')

  return res
}
