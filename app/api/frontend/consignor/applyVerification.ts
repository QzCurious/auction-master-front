'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  name: z.string().min(1),
  identification: z.string().min(1),
  gender: z.coerce.number().refine((v) => v === 1 || v === 2),
  city: z.string().min(1),
  district: z.string().min(1),
  streetAddress: z.string().min(1),
  phone: z.string().min(1),
  bankCode: z.string().min(1),
  bankAccount: z.string().min(1),
  // birthday:2000-01-01T00:00:00+09:00
})

type Data = 'Success'

type ErrorCode = never

export async function applyVerification(formData: FormData) {
  const payload = {
    name: formData.get('name'),
    identification: formData.get('identification'),
    gender: formData.get('gender'),
    city: formData.get('city'),
    district: formData.get('district'),
    streetAddress: formData.get('streetAddress'),
    phone: formData.get('phone'),
    bankCode: formData.get('bankCode'),
    bankAccount: formData.get('bankAccount'),
  }
  throwIfInvalid(payload as any, ReqSchema)

  if (!formData.has('identificationPhoto')) {
    throw new Error('identificationPhoto is required')
  }

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    '/frontend/consignor/verifications',
    {
      method: 'POST',
      body: formData,
    },
  )

  revalidateTag('consignor')

  return res
}
