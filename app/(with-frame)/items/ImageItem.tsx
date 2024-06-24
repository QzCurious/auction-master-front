import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

export default function ImageItem({
  src,
  error,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  src: string | File | null
  error?: string
  onChange?: (file: File | null) => void
  onDelete?: () => void
  onMoveUp?: (() => void) | false
  onMoveDown?: (() => void) | false
}) {
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
    <div>
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

          {onDelete && (
            <button type='button' className='size-7' onClick={() => onDelete()}>
              <span className='sr-only'>Delete</span>
              <XMarkIcon className='rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
            </button>
          )}
        </div>

        <div className='absolute bottom-0 right-0 top-auto flex h-fit justify-end gap-x-2 pb-1.5 pr-1.5'>
          {onMoveUp !== undefined && (
            <button
              type='button'
              className={clsx(
                'size-7',
                !onMoveUp && 'pointer-events-none opacity-50',
              )}
              onClick={() => onMoveUp && onMoveUp()}
            >
              <span className='sr-only'>Move up</span>
              <ArrowLeftIcon className='rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
            </button>
          )}

          {onMoveDown !== undefined && (
            <button
              type='button'
              className={clsx(
                'size-7',
                !onMoveDown && 'pointer-events-none opacity-50',
              )}
              onClick={() => onMoveDown && onMoveDown()}
            >
              <span className='sr-only'>Move down</span>
              <ArrowRightIcon className='rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
            </button>
          )}
        </div>
      </article>
      {error && <p className='text-end text-sm text-red-600'>{error}</p>}
    </div>
  )
}
