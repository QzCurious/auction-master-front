'use server'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { CONSIGNOR_STATUS } from '../GetFrontendConfigs.data'

export interface Consignor {
  id: number
  account: string
  password: string
  nickname: string
  name: string
  identification: string
  gender: number
  birthday: string
  city: string
  district: string
  streetAddress: string
  phone: string
  bankCode: string
  bankAccount: string
  status: CONSIGNOR_STATUS['value']
  verification: null | {
    id: number
    consignorID: number
    photo: string
    name: string
    identification: string
    gender: number
    birthday: string
    city: string
    district: string
    streetAddress: string
    phone: string
    bankCode: string
    bankAccount: string
    status: number
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}

type Data = Consignor

type ErrorCode = never

export async function GetConsignor() {
  const res = await withAuth(apiClient)<Data, ErrorCode>('/frontend/consignor', {
    method: 'GET',
    next: { tags: ['consignor'] },
  })

  return res
}
