'use client'

import { consignment } from '@/app/api/frontend/items/consignment'
import { Item } from '@/app/api/frontend/items/getItem'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

export default function CancelConsignmentBtn({ itemId }: { itemId: Item['id'] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type='button'
      className={clsx(
        'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        isPending && 'pointer-events-none opacity-50',
      )}
      onClick={() => {
        startTransition(async () => {
          const res = await consignment(itemId, { action: 'reject' })
          if (res.error) {
            toast.error(`操作錯誤: ${res.error}`)
            return
          }
          toast.success('託售已取消')
          router.push('/items/consignment-canceled-status')
        })
      }}
    >
      {isPending && (
        <span className='mr-2 inline-block size-3 animate-spin self-center rounded-full border-2 border-l-0 border-indigo-200'></span>
      )}
      取消託售
    </button>
  )
}
