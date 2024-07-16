'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { Children, PropsWithChildren, useEffect, useState } from 'react'

export default function HeroCarousel({ children }: PropsWithChildren) {
  const count = Children.count(children)
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: 0, loop: true }, [
    Autoplay({
      active: count > 1 && process.env.NODE_ENV !== 'development',
      delay: 4000,
    }),
  ])
  const [i, setI] = useState(emblaApi?.selectedScrollSnap() ?? 0)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', ({ selectedScrollSnap }) => setI(selectedScrollSnap()))
    }
  }, [emblaApi])

  return (
    <div ref={emblaRef} className='relative overflow-hidden group-hover:opacity-75'>
      <div className='flex'>{children}</div>

      {count > 1 && (
        <div className='absolute bottom-0 left-0 right-0 mb-2 flex justify-center gap-x-2.5'>
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
      )}
      {count > 1 && (
        <div className='pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex justify-between'>
          <button
            type='button'
            className={clsx(
              'pointer-events-auto h-full w-16 opacity-70 transition-opacity hover:opacity-100 sm:w-20',
            )}
            onClick={() => emblaApi?.scrollPrev()}
          >
            <span className='sr-only'>Move to previous</span>
            <ChevronLeftIcon className='mr-auto size-10 stroke-2 p-1 text-indigo-500 sm:size-14' />
          </button>
          <button
            type='button'
            className={clsx(
              'pointer-events-auto h-full w-16 opacity-70 transition-opacity hover:opacity-100 sm:w-20',
            )}
            onClick={() => emblaApi?.scrollNext()}
          >
            <span className='sr-only'>Move to next</span>
            <ChevronRightIcon className='ml-auto size-10 stroke-2 p-1 text-indigo-500 sm:size-14' />
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
