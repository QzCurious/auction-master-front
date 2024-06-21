import NotSignedInError from '@/app/NotSignedInError'
import { ITEM_STATUS_MAP } from '@/app/api/frontend/configs.data'
import { items } from '@/app/api/frontend/items/items'
import { EyeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import PreviewPhotos from '../PreviewPhotos'
import StatusTabs from '../StatusTabs'

interface PageProps {
  searchParams: {
    limit: string
    offset: string
  }
}

export default async function Page({ searchParams }: PageProps) {
  const itemsRes = await items({
    ...(searchParams as any),
    status: [ITEM_STATUS_MAP.SubmitAppraisalStatus, ITEM_STATUS_MAP.AppraisedStatus],
    sort: 'status',
    order: 'desc',
  })

  if (itemsRes.error === '1003') {
    return <NotSignedInError />
  }

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-7xl overflow-hidden px-4 pb-16 sm:px-6 lg:px-8'>
        <div className='flex justify-between gap-x-4'>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
            我的物品
          </h1>
          <Link
            href='/items/draft/create'
            className='block text-sm font-medium text-indigo-600 hover:text-indigo-500'
          >
            新增物品
            <span aria-hidden='true'> &rarr;</span>
          </Link>
        </div>

        <StatusTabs active='已提交審核' />

        {itemsRes.data.items.length === 0 && (
          <p className='mt-6 text-base leading-6 text-gray-500'>沒有物品</p>
        )}

        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8'>
          {itemsRes.data.items.map((item) => {
            return (
              <div key={item.id} className='relative'>
                <Link
                  href={`/items/appraising/${item.id}`}
                  className='absolute right-1.5 top-1.5 z-20'
                >
                  <EyeIcon
                    className='size-7 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600'
                    aria-hidden='true'
                  />
                </Link>
                <PreviewPhotos photos={item.photos} />

                <h3 className='mt-1 text-xl font-medium text-gray-900'>
                  {item.name}
                </h3>

                {item.status === ITEM_STATUS_MAP['SubmitAppraisalStatus'] && (
                  <p className='inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600'>
                    審核中
                  </p>
                )}
                {item.status === ITEM_STATUS_MAP['AppraisedStatus'] && (
                  <p className='inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700'>
                    審核通過
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
