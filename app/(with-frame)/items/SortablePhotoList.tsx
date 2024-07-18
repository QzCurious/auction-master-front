'use client'
import { Item } from '@/app/api/frontend/items/GetConsignorItems'
import { Bars2Icon } from '@heroicons/react/20/solid'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { useGesture } from '@use-gesture/react'
import clsx from 'clsx'
import { useMotionValue } from 'framer-motion'
import { forwardRef, useEffect, useRef, useState } from 'react'

interface PhotoListProps {
  photos: Item['photos']
  onMove?: (from: number, to: number) => void
  onDelete?: (index: number) => void
}

export default function SortablePhotoList({ photos, onMove, onDelete }: PhotoListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const [isDragging, setIsDragging] = useState<HTMLLIElement | null>(null)
  const draggingXy = useMotionValue<[number, number]>([0, 0])
  const [onto, setOnto] = useState<HTMLLIElement | null>(null)
  const [side, setSide] = useState<'left' | 'right' | null>(null)
  const bind = useGesture({
    onDrag: ({ args, active, xy }) => {
      const i: number = args[0]
      if (!active) return
      setIsDragging(refs.current[i])
      draggingXy.set(xy)
      const target = refs.current.find(
        (el) => el && document.elementsFromPoint(...xy).includes(el),
      )
      if (!target) {
        setOnto(null)
        setSide(null)
        return
      }
      setOnto(target)
      const rect = target.getBoundingClientRect()
      const side = xy[0] < rect.x + rect.width / 2 ? 'left' : 'right'
      setSide(side)
    },
    onDragEnd: ({ args }) => {
      const i: number = args[0]
      setIsDragging(null)
      draggingXy.set([0, 0])
      setOnto(null)
      setSide(null)
      if (onto && side) {
        const ontoI = refs.current.indexOf(onto)
        if (ontoI === i) return
        if (side === 'left' && ontoI - 1 === i) return
        if (side === 'right' && ontoI + 1 === i) return
        onMove?.(i, ontoI)
      }
    },
  })

  if (photos.length === 0) {
    return (
      <div className='flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
        <div className='text-center'>
          <PhotoIcon className='mx-auto h-12 w-12 text-gray-300' aria-hidden='true' />
          <p className='mt-2 text-xs leading-5 text-gray-600'>支援 PNG, JPG, JPEG</p>
        </div>
      </div>
    )
  }

  return (
    <div className='relative overflow-hidden'>
      {isDragging && (
        <div className='absolute inset-y-0 left-0 z-20 -translate-x-1/2'>
          <ScrollPad
            whileHover={() => containerRef.current?.scrollBy({ left: -5 })}
          />
        </div>
      )}

      <div ref={containerRef} className='overflow-x-auto px-1 pb-3'>
        <ul role='list' className='-mx-2 flex'>
          {photos.map(({ photo,sorted }, i) => (
            <li
              key={photo}
              ref={(el) => {
                refs.current[i] = el
              }}
              className={clsx(
                'relative border-indigo-300 px-2',
                onto === refs.current[i] && side === 'left' && 'border-l-2',
                onto === refs.current[i] && side === 'right' && 'border-r-2',
              )}
            >
              <div className='absolute right-0 top-0 z-20 flex w-fit items-center gap-x-2 pr-3 pt-1'>
                <button type='button' onClick={() => onDelete?.(i)}>
                  <span className='sr-only'>Delete</span>
                  <XMarkIcon className='size-7 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
                </button>
                <button type='button' className='touch-none' {...bind(i)}>
                  <span className='sr-only'>Drag to move</span>
                  <Bars2Icon className='size-7 rotate-90 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
                </button>
                {/* <div className='bg-white size-6 grid place-items-center'>
                  {sorted}
                </div> */}
              </div>

              <ImageItem src={photo} />
            </li>
          ))}
        </ul>
      </div>

      {isDragging && (
        <div className='absolute inset-y-0 right-0 translate-x-1/2'>
          <ScrollPad whileHover={() => containerRef.current?.scrollBy({ left: 5 })} />
        </div>
      )}
    </div>
  )
}

function ScrollPad({ whileHover }: { whileHover?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    function handle(e: PointerEvent) {
      const hovered =
        !!ref.current &&
        document.elementsFromPoint(e.clientX, e.clientY).includes(ref.current)
      setActive(hovered)
    }
    document.addEventListener('pointermove', handle)
    return () => document.removeEventListener('pointermove', handle)
  }, [])

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      whileHover?.()
    }, 20)
    return () => clearInterval(id)
  }, [active, whileHover])

  return (
    <div ref={ref} className='h-full max-h-full w-20'>
      <div
        className={clsx(
          'pointer-events-none size-full rounded-full bg-gradient-to-r from-transparent via-gray-300/70 to-transparent opacity-0 transition-opacity',
          active && 'opacity-100',
        )}
      ></div>
    </div>
  )
}

const ImageItem = forwardRef(function ImageItem(
  {
    src,
    error,
    onChange,
  }: {
    src: string | File | null
    error?: string
    onChange?: (file: File | null) => void
  },
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [url, setUrl] = useState(() =>
    src instanceof File ? URL.createObjectURL(src) : src,
  )
  const hasSkippedFirstRender = useRef(false)

  useEffect(() => {
    if (!hasSkippedFirstRender.current) return

    if (src instanceof File) {
      const url = URL.createObjectURL(src)
      setUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [src])

  if (!url) {
    return null
  }

  return (
    <div ref={ref}>
      <article className='aspect-h-7 aspect-w-10 relative block w-60 overflow-hidden rounded-lg bg-gray-100'>
        <img src={url} className='pointer-events-none object-contain' alt='' />

        <div className='absolute right-0 top-0 flex h-fit justify-end gap-x-2 pr-1.5 pt-1.5'>
          {onChange && (
            <label className='size-7 cursor-pointer'>
              <span className='sr-only'>Change</span>
              <ArrowPathIcon className='rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
              <input
                type='file'
                className='sr-only'
                onChange={(e) => onChange(e.target.files?.item(0) ?? null)}
              />
            </label>
          )}
        </div>
      </article>
      {error && <p className='text-end text-sm text-red-600'>{error}</p>}
    </div>
  )
})
