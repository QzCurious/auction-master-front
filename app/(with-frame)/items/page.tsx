import { ITEM_STATUS_DATA, ITEM_STATUS_MAP } from '@/app/api/frontend/configs.data'
import { items } from '@/app/api/frontend/items/items'
import { SearchParamsPagination } from '@/app/components/SearchParamsPagination'
import RedirectToHome from '@/app/RedirectToHome'
import {
  PAGE,
  PaginationSchema,
  PaginationSearchParams,
  ROWS_PER_PAGE,
  SITE_NAME,
} from '@/app/static'
import { PhotoIcon } from '@heroicons/react/20/solid'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { z } from 'zod'
import { DesktopFilters, MobileFilters } from './Filters'

export const metadata = { title: `我的物品 | ${SITE_NAME}` }

const filterSchema = z.object({
  status: z
    .union([z.string(), z.array(z.string())])
    .default([])
    .transform((v) => (typeof v === 'string' ? [v] : v))
    .transform((v) => v.map(Number))
    .transform((v) =>
      v.filter((vv) => Object.values(ITEM_STATUS_MAP).includes(vv as any)),
    ),
})

interface PageProps {
  searchParams: PaginationSearchParams & z.input<typeof filterSchema>
}

export default async function Page({ searchParams }: PageProps) {
  const filter = filterSchema.parse(searchParams)
  const pagination = PaginationSchema.parse(searchParams)
  const itemsRes = await items({
    limit: pagination[ROWS_PER_PAGE],
    offset: pagination[PAGE] * pagination[ROWS_PER_PAGE],
    sort: 'createdAt',
    order: 'desc',
    status: filter.status,
  })

  if (itemsRes.error === '1003') {
    return <RedirectToHome />
  }

  return (
    <div className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
      <h1 className='sr-only'>我的物品</h1>
      <div className='flex gap-x-4'>
        <MobileFilters />
        <div className='mx-auto'></div>
        <Link
          href='/items/create'
          className='flex items-center gap-x-1 font-medium text-indigo-600 hover:text-indigo-500'
        >
          新增物品
          <PlusCircleIcon className='inline-block size-5' />
        </Link>
      </div>

      <div className='mt-6 sm:flex sm:gap-16'>
        <DesktopFilters />

        <div className='grid grow grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8'>
          {itemsRes.data.items.length === 0 && (
            <p className='mt-6 text-base leading-6 text-gray-500'>沒有物品</p>
          )}
          {itemsRes.data.items.map((item) => (
            <article key={item.id} className='relative'>
              <Link href={`/items/edit/${item.id}`}>
                <div className='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75'>
                  <div className='min-w-0 shrink-0 basis-full'>
                    {item.photos.length > 0 ? (
                      <img
                        src={item.photos[0].photo}
                        className='h-full w-full object-contain object-center'
                        alt=''
                      />
                    ) : (
                      <PhotoIcon className='p-8 text-gray-200' />
                    )}
                  </div>
                </div>
              </Link>

              <div className='mt-2 flex items-center gap-x-2'>
                <h2
                  className='truncate text-xl font-medium text-gray-900'
                  title={item.name}
                >
                  {item.name}
                </h2>

                <p className='ml-auto inline-flex flex-none cursor-default items-center rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-800 ring-1 ring-inset ring-gray-500/10'>
                  {
                    ITEM_STATUS_DATA.find(({ value }) => value === item.status)
                      ?.message
                  }
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <SearchParamsPagination count={itemsRes.data.count} />
    </div>
  )
}
