'use client'

import { ConsignorCancelAuctionItem } from '@/app/api/frontend/auction-items/ConsignorCancelAuctionItem'
import { ConsignorCancelAuctionItemByTransfer } from '@/app/api/frontend/auction-items/ConsignorCancelAuctionItemByTransfer'
import { AuctionItem } from '@/app/api/frontend/auction-items/GetConsignorAuctionItems'
import { GetConfigsQueryOptions } from '@/app/api/frontend/GetConfigs.query'
import { GetConsignorWalletBalanceQueryOptions } from '@/app/api/frontend/wallets/GetConsignorWalletBalance.query'
import { Button } from '@/app/catalyst-ui/button'
import RedirectToHome from '@/app/RedirectToHome'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { subDays } from 'date-fns'
import { useCallback, useEffect, useState, useTransition } from 'react'
import toast from 'react-hot-toast'

export default function CancelBiddingPopover({
  auctionItem,
}: {
  auctionItem: AuctionItem
}) {
  const canCancel = useCallback(
    () => subDays(auctionItem.closeAt, 1) > new Date(),
    [auctionItem.closeAt],
  )
  const [show, setShow] = useState(canCancel)
  useEffect(() => {
    const interval = setInterval(() => {
      setShow(canCancel)
    }, 1000)
    return () => clearInterval(interval)
  }, [canCancel])

  if (!show) return null

  return (
    <Popover>
      <PopoverButton as={Button} outline>
        申請取消競標
      </PopoverButton>
      <PopoverPanel
        anchor={{ to: 'top end', gap: 2 }}
        transition
        className={clsx(
          'z-30 rounded border border-black/10 bg-white px-2 py-1.5 shadow-md transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:translate-y-1 data-[closed]:opacity-0',
        )}
      >
        {({ close }) => <PreviewDeal auctionItem={auctionItem} close={close} />}
      </PopoverPanel>
    </Popover>
  )
}

function PreviewDeal({
  auctionItem,
  close,
}: {
  auctionItem: AuctionItem
  close: () => void
}) {
  const configsQuery = useQuery(GetConfigsQueryOptions)
  const walletQuery = useQuery(GetConsignorWalletBalanceQueryOptions)
  const [isSubmitting, startTransition] = useTransition()

  if (configsQuery.error || walletQuery.error) return null
  if (configsQuery.isPending || walletQuery.isPending) return '載入中...'

  if (configsQuery.data.error === '1003' || walletQuery.data.error === '1003') {
    return <RedirectToHome />
  }

  const canPayByWallet =
    walletQuery.data.data >= configsQuery.data.data.auctionItemCancellationFee

  return (
    <section>
      <h3>
        取消競標須支付{' '}
        <span className='underline decoration-indigo-500 decoration-2 underline-offset-2'>
          ¥{configsQuery.data.data.auctionItemCancellationFee}
        </span>
      </h3>
      <div className='mt-2 flex justify-end gap-x-2'>
        {canPayByWallet && (
          <Button
            type='button'
            color='indigo'
            disabled={isSubmitting}
            onClick={() =>
              startTransition(async () => {
                const res = await ConsignorCancelAuctionItem(auctionItem.id)
                if (res.error) {
                  toast.error(`操作錯誤: ${res.error}`)
                  return
                }
                toast.success('取消競標申請已送出')
                close()
              })
            }
          >
            大師幣支付
          </Button>
        )}

        <Button
          type='button'
          outline
          disabled={isSubmitting}
          onClick={() => {
            startTransition(async () => {
              const res = await ConsignorCancelAuctionItemByTransfer(auctionItem.id)
              if (res.error) {
                toast.error(`操作錯誤: ${res.error}`)
                return
              }
              toast.success('取消競標申請已送出')
              close()
            })
          }}
        >
          匯款支付
        </Button>
      </div>
    </section>
  )
}