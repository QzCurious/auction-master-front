import { LineUserBindingCallback } from '@/api/frontend/LineUserBindingCallback'
import { HandleApiError } from '@/domain/api/HandleApiError'
import { getJwt } from '@/domain/auth/getJwt'
import { redirect } from 'next/navigation'
import BindSuccessfully from './BindSuccessfully'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const token = (await searchParams).token
  if (!token || Array.isArray(token))
    return <div>綁定失敗，無法取得token。若持續無法成功請聯繫客服</div>

  const jwt = await getJwt()

  if (!jwt) {
    const goto = '/api/line-user-binding?token=' + token
    return redirect(`/auth/sign-in?goto=${goto}`)
  }

  const res = await LineUserBindingCallback({ token })

  if (res.error) {
    return <HandleApiError error={res.error} />
  }

  return <BindSuccessfully />
}
