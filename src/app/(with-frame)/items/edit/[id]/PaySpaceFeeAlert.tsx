'use client'

import { Configs } from '@/api/frontend/GetConfigs'
import { ExchangeRate } from '@/api/frontend/GetJPYRates'
import { ConsignorPayItemSpaceFee } from '@/api/frontend/items/ConsignorPayItemSpaceFee'
import { ConsignorPayItemSpaceFeeByTransfer } from '@/api/frontend/items/ConsignorPayItemSpaceFeeByTransfer'
import { Item } from '@/api/frontend/items/GetConsignorItem'
import { Button } from '@/catalyst-ui/button'
import { useUntil } from '@/helper/useUntil'
import { currencySign, DATE_FORMAT } from '@/domain/static/static'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

export default function PaySpaceFeeAlert({
  configs,
  walletBalance,
  jpyExchangeRate,
  item,
}: {
  configs: Configs
  walletBalance: number
  jpyExchangeRate: ExchangeRate
  item: Item
}) {
  const spaceFee = configs.costPerSpace * item.space
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const expired = useUntil(item.expireAt, { onFalsy: false })

  if (item.expireAt === null) {
    return null
  }

  if (!expired) {
    return null
  }

  if (item.recordId) {
    return null
  }

  return (
    <section className='rounded-md bg-blue-50 p-4 sm:text-sm'>
      <div className='flex shrink-0 items-center gap-x-3'>
        <InformationCircleIcon
          aria-hidden='true'
          className='h-5 w-5 shrink-0 text-blue-400'
        />
        <h3 className='font-medium text-blue-800'>待繳留倉費</h3>
      </div>

      <div className='ml-8 mt-2'>
        <div className='text-blue-800'>
          <p className='leading-tight'>
            您的物品已於 {format(item.expireAt, DATE_FORMAT)}{' '}
            超過留倉期限，請繳清留倉費{' '}
            <span className='rounded-sm bg-yellow-100 px-0.5'>
              {currencySign('TWD')}
              {spaceFee.toLocaleString()} (約 {currencySign('JPY')}{' '}
              {Math.floor(spaceFee / jpyExchangeRate.buying)})
            </span>{' '}
            以利物品再次上架競標
          </p>

          <div className='mt-4 sm:mt-2'></div>

          <div className='mt-2 flex justify-start gap-x-2'>
            <Button
              type='button'
              color='white'
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await ConsignorPayItemSpaceFeeByTransfer(item.id)
                  if (res.error) {
                    toast.error(`操作錯誤: ${res.error}`)
                    return
                  }
                  toast.success('已申請會匯款結清手續費')
                  router.push(`/records?submit-payment=${res.data}`)
                })
              }}
            >
              匯款支付
            </Button>
            {walletBalance >= spaceFee && (
              <Button
                type='button'
                color='indigo'
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const res = await ConsignorPayItemSpaceFee(item.id)
                    if (res.error === '1703') {
                      toast.error('大師幣不足')
                      return
                    }
                    if (res.error) {
                      toast.error(`操作錯誤: ${res.error}`)
                      return
                    }
                    toast.success('已結清留倉費')
                  })
                }
              >
                大師幣支付
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
