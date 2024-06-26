import { PlusCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CreateItemLink() {
  return (
    <Link
      href='/items/init-status/create'
      className='flex items-center gap-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-500'
    >
      新增物品
      <PlusCircleIcon className='size-5' />
    </Link>
  )
}
