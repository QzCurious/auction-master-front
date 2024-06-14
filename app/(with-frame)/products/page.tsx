import NotSignedInError from '@/app/NotSignedInError'
import { items } from '@/app/api/frontend/items'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import PreviewPhotos from './PreviewPhotos'

interface PageProps {
  searchParams: {
    status: string
    sort: string
    order: string
    limit: string
    offset: string
  }
}

export default async function Page({ searchParams }: PageProps) {
  const itemsRes = await items(searchParams as any)

  if (itemsRes.error === '1003') {
    return <NotSignedInError />
  }

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='md:flex md:items-center md:justify-between'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
            我的商品
          </h2>
          <Link
            href='/products/create'
            className='hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block'
          >
            新增商品
            <span aria-hidden='true'> &rarr;</span>
          </Link>
        </div>

        {itemsRes.data.items.length === 0 && (
          <p className='mt-6 text-base leading-6 text-gray-500'>沒有商品</p>
        )}

        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8'>
          {itemsRes.data.items.map((item) => (
            <div key={item.id} className='relative'>
              <Link
                href={`/products/edit/${item.id}`}
                className='absolute right-1.5 top-1.5 z-20'
              >
                <PencilSquareIcon
                  className='size-7 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600'
                  aria-hidden='true'
                />
              </Link>
              <PreviewPhotos photos={item.photos} />
              <h3 className='mt-4 font-medium text-gray-900'>{item.name}</h3>
              <p className='italic text-gray-500'>type: {item.type}</p>
              <p className='mt-2 font-medium text-gray-900'>${item.reservePrice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
