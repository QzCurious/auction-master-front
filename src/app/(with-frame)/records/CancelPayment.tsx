'use client'

import { ConsignorCancelPayment } from '@/api/frontend/reports/ConsignorCancelPayment'
import { Record } from '@/api/frontend/reports/GetRecords'
import { Button } from '@/catalyst-ui/button'
import { useHandleApiError } from '@/domain/api/HandleApiError'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

export default function CancelPayment({ recordId }: { recordId: Record['id'] }) {
  const [isPending, startTransition] = useTransition()
  const handleApiError = useHandleApiError()

  return (
    <Button
      type='button'
      outline
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await ConsignorCancelPayment(recordId)
          if (res.error) {
            handleApiError(res.error)
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
  //         const res = await ConsignorCancelPayment(recordId)
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
