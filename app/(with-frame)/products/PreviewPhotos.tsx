'use client'

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'

export default function PreviewPhotos({
  photos,
}: {
  photos: Array<{
    photo: string
    index: number
  }>
}) {
  const [i, setI] = useState(0)

  return (
    <div className='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75'>
      <img
        src={photos[i]?.photo ?? ''}
        className='h-full w-full object-cover object-center'
        alt=''
      />

      {photos.length > 1 && (
        <div className='absolute bottom-0 left-0 right-0 top-auto flex h-fit justify-end gap-x-3 px-1.5 pb-1.5'>
          <button
            type='button'
            className={clsx('size-7', i === 0 && 'opacity-50')}
            onClick={() => setI(Math.max(0, i - 1))}
          >
            <span className='sr-only'>Move left</span>
            <ArrowLeftIcon className='rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
          </button>
          <button
            type='button'
            className={clsx('size-7', i === photos.length - 1 && 'opacity-50')}
            onClick={() => setI(Math.min(photos.length - 1, i + 1))}
          >
            <span className='sr-only'>Move right</span>
            <ArrowRightIcon className='rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
          </button>
        </div>
      )}
    </div>
  )
}
