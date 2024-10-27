'use client'

import { AuctionItemDealPreviewQueryOptions } from '@/api/frontend/auction-items/AuctionItemDealPreview.query'
import { ConsignorPayAuctionItemFee } from '@/api/frontend/auction-items/ConsignorPayAuctionItemFee'
import { ConsignorPayAuctionItemFeeTransfer } from '@/api/frontend/auction-items/ConsignorPayAuctionItemFeeTransfer'
import { AuctionItem } from '@/api/frontend/auction-items/GetConsignorAuctionItems'
import { GetConfigsQueryOptions } from '@/api/frontend/GetConfigs.query'
import { GetJPYRatesQueryOptions } from '@/api/frontend/GetJPYRates.query'
import { GetConsignorWalletBalanceQueryOptions } from '@/api/frontend/wallets/GetConsignorWalletBalance.query'
import { Button } from '@/catalyst-ui/button'
import { HandleApiError, useHandleApiError } from '@/domain/api/HandleApiError'
import { currencySign } from '@/domain/static/static'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

export default function PayFeePopover({
  auctionId,
}: {
  auctionId: AuctionItem['auctionId']
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
        {({ close }) => <PayFeeDetail auctionId={auctionId} close={close} />}
      </PopoverPanel>
    </Popover>
  )
}

function PayFeeDetail({
  auctionId,
  close,
}: {
  auctionId: AuctionItem['auctionId']
  close: () => void
}) {
  const router = useRouter()
  const configsQuery = useQuery(GetConfigsQueryOptions)
  const previewQuery = useQuery(AuctionItemDealPreviewQueryOptions(auctionId))
  const walletQuery = useQuery(GetConsignorWalletBalanceQueryOptions)
  const jpyRatesQuery = useQuery(GetJPYRatesQueryOptions)
  const [isPending, startTransition] = useTransition()
  const handleApiError = useHandleApiError()

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

  if (configsQuery.data.error) {
    return <HandleApiError error={configsQuery.data.error} />
  }
  if (previewQuery.data.error) {
    return <HandleApiError error={previewQuery.data.error} />
  }
  if (walletQuery.data.error) {
    return <HandleApiError error={walletQuery.data.error} />
  }
  if (jpyRatesQuery.data.error) {
    return <HandleApiError error={jpyRatesQuery.data.error} />
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
              const res = await ConsignorPayAuctionItemFeeTransfer(auctionId)
              if (res.error) {
                handleApiError(res.error)
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
                const res = await ConsignorPayAuctionItemFee(auctionId)
                if (res.error) {
                  handleApiError(res.error)
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
