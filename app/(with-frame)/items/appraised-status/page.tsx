import RedirectToHome from '@/app/RedirectToHome'
import { ITEM_STATUS_DATA, ITEM_STATUS_MAP } from '@/app/api/frontend/configs.data'
import { items } from '@/app/api/frontend/items/items'
import { SearchParamsPagination } from '@/app/components/SearchParamsPagination'
import {
  PAGE,
  PaginationSchema,
  PaginationSearchParams,
  ROWS_PER_PAGE,
} from '@/app/static'
import { EyeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import CreateItemLink from '../CreateItemLink'
import PreviewPhotos from '../PreviewPhotos'
import StatusTabs from '../StatusTabs'

const STATUS = 'AppraisedStatus' satisfies (typeof ITEM_STATUS_DATA)[number]['key']

interface PageProps {
  searchParams: PaginationSearchParams
}

export default async function Page({ searchParams }: PageProps) {
  const pagination = PaginationSchema.parse(searchParams)
  const itemsRes = await items({
    limit: pagination[ROWS_PER_PAGE],
    offset: pagination[PAGE] * pagination[ROWS_PER_PAGE],
    status: ITEM_STATUS_MAP[STATUS],
    sort: 'status',
    order: 'desc',
  })

  if (itemsRes.error === '1003') {
    return <RedirectToHome />
  }

  return (
    <div className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
      <div className='flex justify-between gap-x-4'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900'>我的物品</h1>
        <CreateItemLink />
      </div>

      <StatusTabs active={STATUS} />

      {itemsRes.data.items.length === 0 && (
        <p className='mt-6 text-base leading-6 text-gray-500'>沒有物品</p>
      )}

      <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8'>
        {itemsRes.data.items.map((item) => {
          return (
            <div key={item.id} className='relative'>
              <Link
                href={`/items/appraised-status/${item.id}`}
                className='absolute right-1.5 top-1.5 z-20'
              >
                <EyeIcon
                  className='size-7 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600'
                  aria-hidden='true'
                />
              </Link>
              <PreviewPhotos photos={item.photos} />

              <h3 className='mt-1 text-xl font-medium text-gray-900'>{item.name}</h3>
            </div>
          )
        })}
      </div>

      <SearchParamsPagination count={itemsRes.data.count} />
    </div>
  )
}