'use client'

import { Item } from '@/api/frontend/items/GetConsignorItem'
import { ItemChoosesCompanyDirectPurchase } from '@/api/frontend/items/ItemChoosesCompanyDirectPurchase'
import { ItemCompanyDirectPurchase } from '@/api/frontend/items/ItemCompanyDirectPurchase'
import { ItemConsignmentReview } from '@/api/frontend/items/ItemConsignmentReview'
import { ItemReady } from '@/api/frontend/items/ItemReady'
import { Content } from '@/app/(with-frame)/commission-rules/Content'
import { Button } from '@/catalyst-ui/button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/catalyst-ui/dialog'
import { Text } from '@/catalyst-ui/text'
import {
  DoubleCheckPopover,
  DoubleCheckPopoverButton,
} from '@/components/DoubleCheckPopover'
import { useHandleApiError } from '@/domain/api/HandleApiError'
import { ConsignorContext } from '@/domain/auth/ConsignorContext'
import { DATE_TIME_FORMAT } from '@/domain/static/static'
import {
  CONSIGNOR_STATUS,
  ITEM_STATUS,
  ITEM_TYPE,
} from '@/domain/static/static-config-mappers'
import { StatusFlow } from '@/domain/static/StatusFlow'
import { useUntil } from '@/helper/useUntil'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import { format } from 'date-fns'
import Link from 'next/link'
import type React from 'react'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'

export function StatusFlowUI({ item }: { item: Item }) {
  const consignor = useContext(ConsignorContext)
  const expired = useUntil(item.expireAt, { onFalsy: false })
  const handleApiError = useHandleApiError()

  if (!consignor) return null

  const actionMap = StatusFlow.makeActionMap('consignor', {
    AppraisedStatus: (
      <div className='w-full'>
        <div className='flex w-full flex-col gap-y-3'>
          <CompanyDirectPurchaseBtn item={item} />
          <ApproveConsignmentBtn item={item} />
          <DoubleCheckPopover
            title='取消期約金額收購'
            onConfirm={async () => {
              const res = await ItemConsignmentReview(item.id, {
                action: 'reject',
              })
              if (res.error) {
                handleApiError(res.error)
                return
              }
              toast.success('期約金額收購已取消')
            }}
          >
            <DoubleCheckPopoverButton
              as={Button}
              outline
              className='h-9 w-full min-w-20'
            >
              取消期約金額收購
            </DoubleCheckPopoverButton>
          </DoubleCheckPopover>
        </div>

        {consignor.status ===
          CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus') && (
          <p className='mt-1 w-32 text-center text-sm text-gray-500'>
            完成
            <Link
              href='/me#identity-form-alert'
              className='text-indigo-600 underline'
            >
              身份認證
            </Link>
            後即可申請賣斷交易或期約金額收購
          </p>
        )}
      </div>
    ),
    ConsignmentApprovedStatus: null,
    ConsignorChoosesCompanyDirectPurchaseStatus: null,
    AppraiserConfirmedStatus: (
      <>
        {item.type === ITEM_TYPE.enum('CompanyDirectPurchaseType') ? (
          <DoubleCheckPopover
            title='確認公司直購'
            onConfirm={async () => {
              const res = await ItemCompanyDirectPurchase(item.id)
              if (res.error) {
                handleApiError(res.error)
                return
              }
              toast.success('已確認公司直購')
            }}
          >
            <DoubleCheckPopoverButton as={Button} color='indigo' className='h-9'>
              確認直購
            </DoubleCheckPopoverButton>
          </DoubleCheckPopover>
        ) : (
          !expired && (
            <DoubleCheckPopover
              title='申請物品上架'
              onConfirm={async () => {
                const res = await ItemReady(item.id)
                if (res.error) {
                  handleApiError(res.error)
                  return
                }
                toast.success('物品上架申請已送出')
              }}
            >
              <DoubleCheckPopoverButton as={Button} color='indigo' className='h-9'>
                申請上架
              </DoubleCheckPopoverButton>
            </DoubleCheckPopover>
          )
        )}
      </>
    ),
  })

  const path = StatusFlow.flowPath({
    from: 'SubmitAppraisalStatus',
    to: ITEM_STATUS.enum(item.status),
    type: item.type ? ITEM_TYPE.enum(item.type) : null,
    withFuture: true,
  })

  const result = path.map((status) => {
    const step = StatusFlow.flow[status]
    const active = ITEM_STATUS.enum(step.status) === item.status
    const time = item.pastStatuses?.[ITEM_STATUS.enum(step.status)]
    const action =
      status in actionMap ? actionMap[status as keyof typeof actionMap] : null

    return (
      <StatusStep
        key={step.status}
        _statusKey={status}
        text={ITEM_STATUS.get('key', step.status).message}
        time={time ? format(time, DATE_TIME_FORMAT) : undefined}
        active={active}
      >
        {active && action}
      </StatusStep>
    )
  })

  return result
}

function StatusStep({
  _statusKey,
  text,
  time,
  children,
  active,
}: {
  _statusKey: string
  text: string
  time?: string
  children?: React.ReactNode
  active: boolean
}) {
  return (
    <div
      className={clsx(
        'relative flex items-start gap-x-4 pb-5 sm:gap-x-3 sm:pb-4',
        '[&[data-active]~[data-status-step]]:[--color:theme(colors.zinc.400)]',
        '[&[data-active]~[data-status-step]]:[--tail-color:theme(colors.zinc.400)]',
        '[&[data-active]]:[--tail-color:theme(colors.zinc.400)]',
        '[&:last-of-type_[data-tail]]:hidden',
        '[&[data-active]~[data-status-step]_[data-time]]:hidden',
      )}
      data-status-step
      data-active={active ? true : undefined}
    >
      <div
        data-tail
        className='absolute left-1 right-0 top-3 h-full w-0.5 bg-[--tail-color,theme(colors.indigo.600)]'
      />
      <div className='relative flex h-6 items-center'>
        <div className='size-2.5 rounded-full bg-[--color,theme(colors.indigo.600)]' />
      </div>
      <div className='flex grow flex-col gap-y-2'>
        <Text
          className={clsx(active && '!text-zinc-950')}
          title={process.env.NODE_ENV === 'development' ? _statusKey : undefined}
          onClick={() => process.env.NODE_ENV === 'development' && copy(_statusKey)}
        >
          {text}
        </Text>
        {time && (
          <Text
            className={clsx('-mt-2 sm:-mt-3', active && '!text-zinc-950')}
            data-time
          >
            {time}
          </Text>
        )}
        {children && <div className='flex gap-x-4'>{children}</div>}
      </div>
    </div>
  )
}

function ApproveConsignmentBtn({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)
  const consignor = useContext(ConsignorContext)
  const handleApiError = useHandleApiError()
  if (!consignor) return null

  return (
    <>
      <Button
        color='indigo'
        className='relative h-9 min-w-20'
        onClick={() => setOpen(true)}
        disabled={
          consignor.status ===
          CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus')
        }
      >
        <div className='absolute -inset-1 animate-pulse rounded-xl border-2 border-indigo-400'></div>
        <div className='absolute right-1 top-1 size-2 rounded-full bg-red-500'></div>
        期約金額收購
      </Button>
      <Dialog open={open} onClose={() => {}} size='2xl'>
        <DialogTitle>網站使用規約</DialogTitle>

        <DialogBody>
          <Content />
        </DialogBody>

        <DialogActions>
          <Button outline onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            color='indigo'
            onClick={async () => {
              const res = await ItemConsignmentReview(item.id, { action: 'approve' })
              if (res.error) {
                handleApiError(res.error)
                return
              }
              toast.success('已申請期約金額收購')
              setOpen(false)
              window.scrollTo({ top: 0 })
            }}
          >
            確認期約金額收購
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function CompanyDirectPurchaseBtn({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)
  const consignor = useContext(ConsignorContext)
  const handleApiError = useHandleApiError()
  if (!consignor) return null

  return (
    <>
      <Button
        color='sky'
        className='relative block h-9 w-full min-w-20'
        onClick={() => setOpen(true)}
        disabled={
          consignor.status ===
          CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus')
        }
      >
        <div className='absolute -inset-1 animate-pulse rounded-xl border-2 border-sky-400'></div>
        <div className='absolute right-1 top-1 size-2 rounded-full bg-red-500'></div>
        賣斷交易
      </Button>
      <Dialog open={open} onClose={() => {}} size='2xl'>
        <DialogTitle>網站使用規約</DialogTitle>

        <DialogBody>
          <Content />
        </DialogBody>

        <DialogActions>
          <Button outline onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            color='indigo'
            onClick={async () => {
              const res = await ItemChoosesCompanyDirectPurchase(item.id)
              if (res.error) {
                handleApiError(res.error)
                return
              }
              toast.success('已申請賣斷交易')
              setOpen(false)
            }}
          >
            賣斷交易
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
