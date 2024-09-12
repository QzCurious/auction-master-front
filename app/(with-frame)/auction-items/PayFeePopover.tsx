'use client'

import { AuctionItemDealPreviewQueryOptions } from '@/app/api/frontend/auction-items/AuctionItemDealPreview.query'
import { ConsignorPayAuctionItemFee } from '@/app/api/frontend/auction-items/ConsignorPayAuctionItemFee'
import { ConsignorPayAuctionItemFeeTransfer } from '@/app/api/frontend/auction-items/ConsignorPayAuctionItemFeeTransfer'
import { AuctionItem } from '@/app/api/frontend/auction-items/GetConsignorAuctionItems'
import { GetConfigsQueryOptions } from '@/app/api/frontend/GetConfigs.query'
import { GetJPYRatesQueryOptions } from '@/app/api/frontend/GetJPYRates.query'
import { GetConsignorWalletBalanceQueryOptions } from '@/app/api/frontend/wallets/GetConsignorWalletBalance.query'
import { Button } from '@/app/catalyst-ui/button'
import RedirectToHome from '@/app/RedirectToHome'
import { currencySign } from '@/app/static'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

export default function PayFeePopover({
  auctionItemId,
}: {
  auctionItemId: AuctionItem['id']
}) {
  return (
    <Popover>
      <PopoverButton as={Button} outline>
        結清手續費
      </PopoverButton>
      <PopoverPanel
        anchor={{ to: 'top end', gap: 2 }}
        transition
        className={clsx(
          'z-30 rounded border border-black/10 bg-white px-2 py-1.5 shadow-md transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:translate-y-1 data-[closed]:opacity-0',
        )}
      >
        {({ close }) => <PayFeeDetail auctionItemId={auctionItemId} close={close} />}
      </PopoverPanel>
    </Popover>
  )
}

function PayFeeDetail({
  auctionItemId,
  close,
}: {
  auctionItemId: AuctionItem['id']
  close: () => void
}) {
  const router = useRouter()
  const configsQuery = useQuery(GetConfigsQueryOptions)
  const previewQuery = useQuery(AuctionItemDealPreviewQueryOptions(auctionItemId))
  const walletQuery = useQuery(GetConsignorWalletBalanceQueryOptions)
  const jpyRatesQuery = useQuery(GetJPYRatesQueryOptions)
  const [isPending, startTransition] = useTransition()

  if (
    configsQuery.error ||
    previewQuery.error ||
    walletQuery.error ||
    jpyRatesQuery.error
  )
    return null
  if (
    configsQuery.isPending ||
    previewQuery.isPending ||
    walletQuery.isPending ||
    jpyRatesQuery.isPending
  )
    return <section className='w-max'>載入中...</section>

  if (
    configsQuery.data.error === '1003' ||
    previewQuery.data.error === '1003' ||
    walletQuery.data.error === '1003' ||
    jpyRatesQuery.data.error === '1003'
  ) {
    return <RedirectToHome />
  }

  const canPayByWallet =
    walletQuery.data.data >= previewQuery.data.data.yahooAuctionFee

  return (
    <section className='w-max'>
      <h3>
        尚有日拍{' '}
        <span className='underline decoration-indigo-500 decoration-2 underline-offset-2'>
          手續費 {currencySign('JPY')}
          {previewQuery.data.data.yahooAuctionFee.toLocaleString()}
        </span>{' '}
        <span className='text-zinc-500'>
          (約 {currencySign('TWD')}
          {Math.ceil(
            previewQuery.data.data.yahooAuctionFee * jpyRatesQuery.data.data.selling,
          ).toLocaleString()}
          )
        </span>{' '}
        未支付
      </h3>
      <div className='mt-2 flex justify-end gap-x-2'>
        <Button
          type='button'
          outline
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const res = await ConsignorPayAuctionItemFeeTransfer(auctionItemId)
              if (res.error) {
                toast.error(`操作錯誤: ${res.error}`)
                return
              }
              toast.success('已申請會匯款結清手續費')
              close()
              router.push(`/records?submit-payment=${res.data}`)
            })
          }}
        >
          匯款支付
        </Button>
        {canPayByWallet && (
          <Button
            type='button'
            color='indigo'
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const res = await ConsignorPayAuctionItemFee(auctionItemId)
                if (res.error === '1703') {
                  toast.error('大師幣不足')
                  return
                }
                if (res.error) {
                  toast.error(`操作錯誤: ${res.error}`)
                  return
                }
                toast.success('已結清手續費')
                close()
              })
            }
          >
            大師幣支付
          </Button>
        )}
      </div>
    </section>
  )
}
