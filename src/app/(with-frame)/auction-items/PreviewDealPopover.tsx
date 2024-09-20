'use client'

import { AuctionItemDealPreviewQueryOptions } from '@/api/frontend/auction-items/AuctionItemDealPreview.query'
import { AuctionItem } from '@/api/frontend/auction-items/GetConsignorAuctionItems'
import { Button } from '@/catalyst-ui/button'
import { currencySign } from '@/domain/static/static'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

export default function PreviewDealPopover({
  auctionItemId,
}: {
  auctionItemId: AuctionItem['id']
}) {
  return (
    <Popover>
      <PopoverButton as={Button} outline>
        成交詳情
      </PopoverButton>
      <PopoverPanel
        anchor={{ to: 'top end', gap: 2 }}
        transition
        className={clsx(
          'z-30 rounded border border-black/10 bg-white px-2 py-1.5 shadow-md transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:translate-y-1 data-[closed]:opacity-0',
        )}
      >
        <PreviewDeal auctionItemId={auctionItemId} />
      </PopoverPanel>
    </Popover>
  )
}

function PreviewDeal({ auctionItemId }: { auctionItemId: AuctionItem['id'] }) {
  const { isPending, data, error } = useQuery(
    AuctionItemDealPreviewQueryOptions(auctionItemId),
  )

  if (error || data?.error) return null
  if (isPending) return '載入中...'

  return (
    <table>
      <tbody>
        <tr>
          <td>結算金額</td>
          <td className='pl-4 text-end'>
            {currencySign('JPY')}
            {data.data.price.toLocaleString()}
          </td>
        </tr>
        <tr>
          <td>日拍手續費</td>
          <td className='pl-4 text-end text-rose-600'>
            {currencySign('JPY')}
            {data.data.yahooAuctionFee.toLocaleString()}
          </td>
        </tr>
        <tr>
          <td>平台手續費</td>
          <td className='pl-4 text-end text-rose-600'>
            {currencySign('JPY')}
            {data.data.commission.toLocaleString()}
          </td>
        </tr>
        <tr>
          <td>紅利</td>
          <td className='pl-4 text-end'>
            {data.data.commissionBonus.toLocaleString()}
          </td>
        </tr>

        <tr>
          <td className='h-2' colSpan={2}>
            <div className='flex h-full items-center'>
              <div className='w-full border-t border-zinc-300'></div>
            </div>
          </td>
        </tr>

        <tr>
          <td>大師幣</td>
          <td className='pl-4 text-end'>
            {currencySign('JPY')}
            {data.data.price - data.data.yahooAuctionFee - data.data.commission}
          </td>
        </tr>
        <tr>
          <td>紅利</td>
          <td className='pl-4 text-end'>
            {data.data.commissionBonus.toLocaleString()}
          </td>
        </tr>
      </tbody>
    </table>
  )
}
