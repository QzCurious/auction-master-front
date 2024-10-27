import { GetConsignorItems } from '@/api/frontend/items/GetConsignorItems'
import { Button } from '@/catalyst-ui/button'
import { Heading } from '@/catalyst-ui/heading'
import { SearchParamsPagination } from '@/components/SearchParamsPagination'
import { HandleApiError } from '@/domain/api/HandleApiError'
import { parseSearchParams } from '@/domain/crud/parseSearchParams'
import { PAGE, ROWS_PER_PAGE, SITE_NAME } from '@/domain/static/static'
import { ITEM_STATUS } from '@/domain/static/static-config-mappers'
import { AutoRefreshEffect } from '@/helper/useAutoRefresh'
import { Until } from '@/helper/useUntil'
import { PhotoIcon } from '@heroicons/react/20/solid'
import { PlusIcon } from '@heroicons/react/24/outline'
import { FileDashed } from '@phosphor-icons/react/dist/ssr/FileDashed'
import { Metadata } from 'next'
import Link from 'next/link'
import { DesktopFilters, MobileFilters } from './Filters'
import { SearchParamsSchema } from './SearchParamsSchema'

export const metadata = { title: `我的物品 | ${SITE_NAME}` } satisfies Metadata

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: PageProps) {
  const filter = parseSearchParams(SearchParamsSchema, searchParams)
  const itemsRes = await GetConsignorItems({
    limit: filter[ROWS_PER_PAGE],
    offset: filter[PAGE] * filter[ROWS_PER_PAGE],
    sort: 'createdAt',
    order: 'desc',
    status: filter.status,
  })

  if (itemsRes.error) {
    return <HandleApiError error={itemsRes.error} />
  }

  return (
    <AutoRefreshEffect ms={30_000}>
      <div className='flex gap-x-4'>
        <div>
          <Heading level={1}>我的物品</Heading>
          <div className='mt-2.5'>
            <MobileFilters
              selected={filter.status}
              statusCount={itemsRes.data.statusCounts}
            />
          </div>
        </div>

        <div className='mx-auto'></div>
        <Button href='/items/create' color='indigo' className='self-start'>
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
              <div className='mx-auto w-fit text-zinc-400'>
                <FileDashed className='mx-auto size-20' />
                <p className='mt-6 text-center text-lg leading-6'>沒有資料</p>
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

              {!!item.expireAt && !item.recordId && (
                <Until date={new Date(item.expireAt)}>
                  <div className='absolute right-2 top-2'>
                    <p className='inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>
                      待繳留倉費
                    </p>
                  </div>
                </Until>
              )}

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
    </AutoRefreshEffect>
  )
}
