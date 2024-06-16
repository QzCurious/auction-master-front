'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState } from 'react'

export default function PreviewPhotos({
  photos,
}: {
  photos: Array<{
    sorted: number
    photo: string
  }>
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: 0 })
  const [i, setI] = useState(emblaApi?.selectedScrollSnap() ?? 0)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', ({ selectedScrollSnap }) => setI(selectedScrollSnap()))
    }
  }, [emblaApi])

  return (
    <div
      ref={emblaRef}
      className='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75'
    >
      <div className='flex'>
        {photos.map(({ photo, sorted }) => (
          <div key={sorted} className='min-w-0 shrink-0 basis-full'>
            <img
              src={photo}
              className='h-full w-full object-cover object-center'
              alt=''
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <div className='absolute bottom-0 left-0 right-0 top-0 flex justify-between'>
          <button
            type='button'
            className={clsx(
              'h-full w-20 bg-gradient-to-r from-black/60 to-black/0 opacity-50 transition-opacity hover:opacity-100',
              i === 0 && 'pointer-events-none !opacity-0',
            )}
            onClick={() => emblaApi?.scrollPrev()}
          >
            <span className='sr-only'>Move to previous</span>
            <ChevronLeftIcon className='mr-auto size-12 stroke-2 p-1 text-white' />
          </button>
          <button
            type='button'
            className={clsx(
              'h-full w-20 bg-gradient-to-l from-black/60 to-black/0 opacity-50 transition-opacity hover:opacity-100',
              i === photos.length - 1 && 'pointer-events-none !opacity-0',
            )}
            onClick={() => emblaApi?.scrollNext()}
          >
            <span className='sr-only'>Move to next</span>
            <ChevronRightIcon className='ml-auto size-12 stroke-2 p-1 text-white' />
          </button>
        </div>
      )}
    </div>
  )
}
