'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { CONSIGNOR_STATUS } from '@/domain/static/static-config-mappers'

export interface Consignor {
  id: number
  avatar: string
  account: string
  password: string
  nickname: string
  lineId: string
  commissionBonusRate: number
  name: string
  identification: string
  gender: number
  birthday: string
  city: string
  district: string
  streetAddress: string
  phone: string
  beneficiaryName: string
  bankCode: string
  bankAccount: string
  status: CONSIGNOR_STATUS['value']
  createdAt: string
  updatedAt: string
  verification?: {
    id: number
    consignorId: number
    photo: string
    name: string
    identification: string
    gender: number
    birthday: string
    city: string
    district: string
    streetAddress: string
    phone: string
    beneficiaryName: string
    bankCode: string
    bankAccount: string
    status: number
    createdAt: string
    updatedAt: string
  }
  walletBalance: number
  bonusBalance: number
}

type Data = Consignor

export async function GetConsignor() {
  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>('frontend/consignor', {
      next: { tags: ['consignor'] },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
