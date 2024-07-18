import RedirectToHome from '@/app/RedirectToHome'
import { getExchangeRate } from '@/app/api/getExchangeRate'
import { getUser } from '@/app/api/helpers/getUser'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ItemForm from '../ItemForm'

async function Page() {
  return (
    <div className='mx-auto max-w-3xl px-8'>
      <Link
        className='inline-flex items-center gap-x-1 text-sm text-indigo-600 hover:text-indigo-500'
        href='/items'
      >
        <ArrowLeftIcon className='size-4 stroke-2' />
        回到物品列表
      </Link>

      <h1 className='mb-4 text-2xl font-bold tracking-tight text-gray-900'>
        新增物品
      </h1>

      <Content />
    </div>
  )
}

export default Page

async function Content() {
  const user = await getUser()

  if (!user) {
    return <RedirectToHome />
  }

  return <ItemForm yenToNtdRate={await getExchangeRate('JPY', 'NTD')} />
}
