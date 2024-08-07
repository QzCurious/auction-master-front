import { ITEM_STATUS } from '@/app/api/frontend/GetFrontendConfigs.data'
import { GetConsignorItems } from '@/app/api/frontend/items/GetConsignorItems'
import { Button } from '@/app/catalyst-ui/button'
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
import { PlusIcon } from '@heroicons/react/24/outline'
import { FileDashed } from '@phosphor-icons/react/dist/ssr/FileDashed'
import Link from 'next/link'
import * as R from 'remeda'
import { z } from 'zod'
import AutoRefreshPage from './AutoRefreshPage'
import { DesktopFilters, MobileFilters } from './Filters'

export const metadata = { title: `我的物品 | ${SITE_NAME}` }

const filterSchema = z.object({
  status: z
    .preprocess(
      (v) => (typeof v === 'string' ? [v] : v),
      z.coerce
        .number()
        .refine(R.isIncludedIn(ITEM_STATUS.data.map((item) => item.value)))
        .array(),
    )
    .default([]),
})

interface PageProps {
  searchParams: PaginationSearchParams & z.input<typeof filterSchema>
}

export default async function Page({ searchParams }: PageProps) {
  const filter = filterSchema.parse(searchParams)
  const pagination = PaginationSchema.parse(searchParams)
  const itemsRes = await GetConsignorItems({
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
    <AutoRefreshPage ms={10_000}>
      <div className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
        <h1 className='sr-only'>我的物品</h1>
        <div className='flex gap-x-4'>
          <MobileFilters
            selected={filter.status}
            statusCount={itemsRes.data.statusCounts}
          />
          <div className='mx-auto'></div>
          <Button href='/items/create' color='indigo' className='!px-4'>
            <PlusIcon className='inline-block !size-5 stroke-2 !text-white' />
            <span className='text-base'>新增物品</span>
          </Button>
        </div>

        <div className='mt-6 sm:flex sm:gap-16'>
          <DesktopFilters
            selected={filter.status}
            statusCount={itemsRes.data.statusCounts}
          />

          <div className='grid grow grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8'>
            {itemsRes.data.items.length === 0 && (
              <div className='col-span-full grid place-items-center'>
                <div className='mx-auto w-fit text-indigo-400'>
                  <FileDashed className='mx-auto size-20' />
                  <p className='mt-6 text-center text-lg leading-6'>目前沒有物品</p>
                </div>
              </div>
            )}
            {itemsRes.data.items.map((item) => (
              <article key={item.id} className='relative'>
                <Link href={`/items/edit/${item.id}`}>
                  <div className='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg border border-gray-200 group-hover:opacity-75'>
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
                    className='truncate text-xl font-medium text-indigo-500'
                    title={item.name}
                  >
                    {item.name}
                  </h2>

                  <p className='ml-auto inline-flex flex-none cursor-default items-center rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-800 ring-1 ring-inset ring-gray-500/10'>
                    {ITEM_STATUS.get('value', item.status).message}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <SearchParamsPagination count={itemsRes.data.count} />
      </div>
    </AutoRefreshPage>
  )
}
