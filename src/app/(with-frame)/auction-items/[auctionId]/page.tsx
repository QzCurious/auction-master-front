import { GetConsignorAuctionItem } from '@/api/frontend/auction-items/GetConsignorAuctionItem'
import { GetConsignor } from '@/api/frontend/consignor/GetConsignor'
import { Heading } from '@/catalyst-ui/heading'
import RedirectAuthError from '@/domain/auth/RedirectAuthError'
import { SITE_NAME } from '@/domain/static/static'
import { CONSIGNOR_STATUS } from '@/domain/static/static-config-mappers'
import { AutoRefreshEffect } from '@/helper/useAutoRefresh'
import { Metadata } from 'next'
import { redirect, RedirectType } from 'next/navigation'
import { AuctionItemsTable } from '../AuctionItemTable'

export const metadata = { title: `競標商品 | ${SITE_NAME}` } satisfies Metadata

interface PageProps {
  params: { auctionId: string }
}

export default async function Page({ params: { auctionId } }: PageProps) {
  const [consignorRes, auctionItemRes] = await Promise.all([
    GetConsignor(),
    GetConsignorAuctionItem(auctionId),
  ])

  if (auctionItemRes.error === '1003' || consignorRes.error === '1003') {
    return <RedirectAuthError />
  }

  if (
    consignorRes.data.status ===
    CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus')
  ) {
    redirect('/me?alert#identity-form-alert', RedirectType.replace)
  }

  return (
    <AutoRefreshEffect ms={10_000}>
      <Heading level={1}>競標商品</Heading>

      <div className='mt-6 sm:flex sm:gap-16'>
        <AuctionItemsTable rows={[auctionItemRes.data]} count={1} />
      </div>
    </AutoRefreshEffect>
  )
}
