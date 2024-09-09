'use client'

import { ConsignorItemReturning } from '@/app/api/frontend/items/ConsignorItemReturning'
import { Item } from '@/app/api/frontend/items/GetConsignorItem'
import { Button } from '@/app/catalyst-ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@/app/catalyst-ui/dialog'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'

export default function ReturnItemDialog({ item }: { item: Item }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <>
      <Button
        type='button'
        outline
        className='w-full'
        onClick={() => setIsOpen(true)}
      >
        我要退貨
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>申請退貨</DialogTitle>
        <DialogBody>後續退貨細節請聯繫客服 (可一次退多個物品)</DialogBody>
        <DialogActions>
          <Button
            type='button'
            plain
            disabled={isPending}
            onClick={() => setIsOpen(false)}
          >
            取消
          </Button>
          <Button
            type='button'
            color='indigo'
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const res = await ConsignorItemReturning(item.id)
                if (res.error) {
                  toast.error(`操作錯誤: ${res.error}`)
                  return
                }
                toast.success('退貨申請已送出，請聯繫客服')
              })
            }}
          >
            送出申請
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
