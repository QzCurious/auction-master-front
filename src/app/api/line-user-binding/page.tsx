import { getJwt } from '@/domain/auth/getJwt'
import { redirect } from 'next/navigation'
import AutoSubmit from './AutoSubmit'

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

  return <AutoSubmit token={token} />
}
