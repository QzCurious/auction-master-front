'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'
import { Children, PropsWithChildren, useEffect, useState } from 'react'

export default function HeroCarousel({ children }: PropsWithChildren) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: 0 })
  const [i, setI] = useState(emblaApi?.selectedScrollSnap() ?? 0)
  const count = Children.count(children)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', ({ selectedScrollSnap }) => setI(selectedScrollSnap()))
    }
  }, [emblaApi])

  return (
    <div
      ref={emblaRef}
      className='relative overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75'
    >
      <div className='flex'>{children}</div>

      <div className='absolute bottom-0 left-0 right-0 mb-2 flex justify-center gap-x-3'>
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            type='button'
            className={clsx(
              'size-2.5 rounded-full bg-indigo-500 hover:opacity-70',
              i === index ? 'opacity-100' : 'opacity-50',
            )}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>

      {count > 1 && (
        <div className='pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex justify-between'>
          <button
            type='button'
            className={clsx(
              'h-full w-20 transition-opacity hover:opacity-100',
              i === 0
                ? 'pointer-events-none opacity-0'
                : 'pointer-events-auto opacity-70',
            )}
            onClick={() => emblaApi?.scrollPrev()}
          >
            <span className='sr-only'>Move to previous</span>
            <ChevronLeftIcon className='mr-auto size-14 stroke-2 p-1 text-indigo-500 ' />
          </button>
          <button
            type='button'
            className={clsx(
              'h-full w-20 transition-opacity hover:opacity-100',
              i === count - 1
                ? 'pointer-events-none opacity-0'
                : 'pointer-events-auto opacity-70',
            )}
            onClick={() => emblaApi?.scrollNext()}
          >
            <span className='sr-only'>Move to next</span>
            <ChevronRightIcon className='ml-auto size-14 stroke-2 p-1 text-indigo-500' />
          </button>
        </div>
      )}
    </div>
  )
}

export function HeroCarouselItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('min-w-0 shrink-0 basis-full', className)} {...props}>
      {children}
    </div>
  )
}

function CarouselIndicator({
  i,
  index,
  emblaApi,
}: {
  i: number
  index: number
  emblaApi: any
}) {
  return (
    <button
      type='button'
      className={clsx(
        'h-2 w-2 rounded-full bg-indigo-500 opacity-50 hover:opacity-100',
        i === index && 'opacity-100',
      )}
      onClick={() => emblaApi?.scrollTo(index)}
    />
  )
}
