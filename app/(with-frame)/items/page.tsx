import NotSignedInError from '@/app/NotSignedInError'
import { configs } from '@/app/api/frontend/configs'
import { items } from '@/app/api/frontend/items/items'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import Link from 'next/link'
import PreviewPhotos from './PreviewPhotos'

interface PageProps {
  searchParams: {
    sort: string
    order: string
    limit: string
    offset: string
  }
}

export default async function Page({ searchParams }: PageProps) {
  const itemsRes = await items(searchParams as any)
  const configsRes = await configs()

  if (itemsRes.error === '1003' || configsRes.error === '1003') {
    return <NotSignedInError />
  }

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='md:flex md:items-center md:justify-between'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
            我的物品
          </h2>
          <Link
            href='/items/create'
            className='hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block'
          >
            新增物品
            <span aria-hidden='true'> &rarr;</span>
          </Link>
        </div>

        {itemsRes.data.items.length === 0 && (
          <p className='mt-6 text-base leading-6 text-gray-500'>沒有物品</p>
        )}

        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8'>
          {itemsRes.data.items.map((item) => {
            const type = configsRes.data.itemType.find(
              ({ value }) => value === item.type,
            )
            return (
              <div key={item.id} className='relative'>
                <Link
                  href={`/items/edit/${item.id}`}
                  className='absolute right-1.5 top-1.5 z-20'
                >
                  <PencilSquareIcon
                    className='size-7 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600'
                    aria-hidden='true'
                  />
                </Link>
                <PreviewPhotos photos={item.photos} />
                <div className='mt-3 flex items-center justify-between gap-x-2'>
                  <h3 className='font-medium text-gray-900'>{item.name}</h3>
                  {!!type && (
                    <p className='rounded border border-gray-500 px-1 text-sm text-gray-500'>
                      {type.message}
                    </p>
                  )}
                </div>
                <p className='font-medium text-gray-900'>
                  底價: ${item.reservePrice}
                </p>
                {!!item.expireAt && (
                  <p className='italic text-gray-500'>
                    時效: {format(item.expireAt, 'yyyy-MM-dd HH:mm:ss')}
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
