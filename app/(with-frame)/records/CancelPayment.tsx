'use client'

import { ConsignorCancelPayment } from '@/app/api/frontend/reports/ConsignorCancelPayment'
import { Record } from '@/app/api/frontend/reports/GetRecords'
import { Button } from '@/app/catalyst-ui/button'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

export default function CancelPayment({ recordID }: { recordID: Record['id'] }) {
  const [isPending, startTransition] = useTransition()
  return (
    <Button
      type='button'
      outline
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await ConsignorCancelPayment(recordID)
          if (res.error) {
            toast.error(`操作錯誤: ${res.error}`)
            return
          }
          toast.success('已取消付款')
        })
      }}
    >
      取消付款
    </Button>
  )
  //   return (
  //     <DoubleCheckPopover
  //       title='取消付款'
  //       onConfirm={async () => {
  //         const res = await ConsignorCancelPayment(recordID)
  //         if (res.error) {
  //           toast.error(`操作錯誤: ${res.error}`)
  //           return
  //         }
  //         toast.success('已取消付款')
  //       }}
  //     >
  //       <DoubleCheckPopoverButton as={Button} outline>
  //         取消付款
  //       </DoubleCheckPopoverButton>
  //     </DoubleCheckPopover>
  //   )
}
