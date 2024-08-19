'use client'

import { ConsignorCancelAuctionItem } from '@/app/api/frontend/auction-items/ConsignorCancelAuctionItem'
import { AuctionItem } from '@/app/api/frontend/auction-items/GetConsignorAuctionItems'
import { GetConfigsQueryOptions } from '@/app/api/frontend/GetConfigs.query'
import { GetConsignorWalletBalanceQueryOptions } from '@/app/api/frontend/wallets/GetConsignorWalletBalance.query'
import { Button } from '@/app/catalyst-ui/button'
import RedirectToHome from '@/app/RedirectToHome'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

export default function CancelBiddingPopover({
  auctionItemId,
}: {
  auctionItemId: AuctionItem['id']
}) {
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
        {({ close }) => <PreviewDeal auctionItemId={auctionItemId} close={close} />}
      </PopoverPanel>
    </Popover>
  )
}

function PreviewDeal({
  auctionItemId,
  close,
}: {
  auctionItemId: AuctionItem['id']
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
        取消競標須支付
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
                const res = await ConsignorCancelAuctionItem(auctionItemId)
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
          outline
          href={configsQuery.data.data.lineURL}
          target='_blank'
          rel='noopener noreferrer'
          onClick={close}
        >
          聯絡客服取消
        </Button>
      </div>
    </section>
  )
}
