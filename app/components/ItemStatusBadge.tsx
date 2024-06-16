import { itemStatusTextMap } from '../static'

export default function ItemStatusBadge({ status }: { status: number }) {
  return (
    <p className='inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600'>
      {itemStatusTextMap[status]}
    </p>
  )
}
