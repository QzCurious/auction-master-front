import { GetConsignorAuctionItems } from '@/api/frontend/auction-items/GetConsignorAuctionItems'
import { GetConsignor } from '@/api/frontend/consignor/GetConsignor'
import { Heading } from '@/catalyst-ui/heading'
import { HandleApiError } from '@/domain/api/HandleApiError'
import { parseSearchParams } from '@/domain/crud/parseSearchParams'
import { PAGE, ROWS_PER_PAGE, SITE_NAME } from '@/domain/static/static'
import { CONSIGNOR_STATUS } from '@/domain/static/static-config-mappers'
import { AutoRefreshEffect } from '@/helper/useAutoRefresh'
import { Metadata } from 'next'
import { redirect, RedirectType } from 'next/navigation'
import { AuctionItemsTable } from './AuctionItemTable'
import { DesktopFilters, MobileFilters } from './Filters'
import { SearchParamsSchema } from './SearchParamsSchema'

export const metadata = { title: `競標列表 | ${SITE_NAME}` } satisfies Metadata

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: PageProps) {
  const filters = parseSearchParams(SearchParamsSchema, searchParams)

  const [consignorRes, auctionItemsRes] = await Promise.all([
    GetConsignor(),
    GetConsignorAuctionItems({
      status: filters.status,
      sort: 'createdAt',
      order: 'desc',
      limit: filters[ROWS_PER_PAGE],
      offset: filters[PAGE] * filters[ROWS_PER_PAGE],
    }),
  ])

  if (auctionItemsRes.error) {
    return <HandleApiError error={auctionItemsRes.error} />
  }
  if (consignorRes.error) {
    return <HandleApiError error={consignorRes.error} />
  }

  if (
    consignorRes.data.status ===
    CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus')
  ) {
    redirect('/me?alert#identity-form-alert', RedirectType.replace)
  }

  return (
    <AutoRefreshEffect ms={10_000}>
      <Heading level={1}>競標列表</Heading>

      <div className='mt-2.5'>
        <MobileFilters selected={filters.status} />
      </div>

      <div className='mt-6 sm:flex sm:gap-16'>
        <DesktopFilters selected={filters.status} />

        <AuctionItemsTable
          rows={auctionItemsRes.data.auctionItems}
          count={auctionItemsRes.data.count}
        />
      </div>
    </AutoRefreshEffect>
  )
}
