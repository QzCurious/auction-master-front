'use client'

import { consignment } from '@/app/api/frontend/items/consignment'
import { Item } from '@/app/api/frontend/items/getItem'
import clsx from 'clsx'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

export default function ApproveConsignmentBtn({
  itemId,
  disabled,
}: {
  itemId: Item['id']
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      aria-disabled={disabled}
      className={clsx(
        'w-full rounded-md bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        (isPending || disabled) && 'cursor-not-allowed opacity-50',
      )}
      onClick={() => {
        if (isPending || disabled) return
        startTransition(async () => {
          const res = await consignment(itemId, { action: 'approve' })
          if (res.error) {
            toast.error(`操作錯誤: ${res.error}`)
            return
          }
          toast.success('已申請託售')
        })
      }}
    >
      {isPending && (
        <span className='mr-2 inline-block size-3 animate-spin self-center rounded-full border-2 border-l-0 border-indigo-200'></span>
      )}
      託售
    </button>
  )
}
