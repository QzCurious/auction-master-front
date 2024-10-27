'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { throwIfInvalid } from '@/api/core/static'

const ReqSchema = z.object({
  name: z.string().min(1),
  identification: z.string().min(1),
  gender: z.coerce.number().refine((v) => v === 1 || v === 2),
  birthday: z.coerce.date(),
  city: z.string().min(1),
  district: z.string().min(1),
  streetAddress: z.string().min(1),
  phone: z.string().min(1),
  beneficiaryName: z.string().min(1),
  bankCode: z.string().min(1),
  bankAccount: z.string().min(1),
})

type Data = 'Success'

export async function CreateConsignorVerification(formData: FormData) {
  throwIfInvalid(
    {
      name: formData.get('name'),
      identification: formData.get('identification'),
      gender: formData.get('gender'),
      birthday: formData.get('birthday'),
      city: formData.get('city'),
      district: formData.get('district'),
      streetAddress: formData.get('streetAddress'),
      phone: formData.get('phone'),
      beneficiaryName: formData.get('beneficiaryName'),
      bankCode: formData.get('bankCode'),
      bankAccount: formData.get('bankAccount'),
    } as any,
    ReqSchema,
  )

  if (!formData.has('identificationPhoto')) {
    throw new Error('identificationPhoto is required')
  }

  const res = await apiClientWithToken
    .post<SuccessResponseJson<Data>>('frontend/consignor/verifications', {
      body: formData,
    })
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('consignor')
  revalidateTag('items')

  return res
}
