'use client'

import { useGesture } from '@use-gesture/react'
import clsx from 'clsx'
import {
  ComponentPropsWithoutRef,
  createContext,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

interface Onto {
  el: HTMLElement
  side: 'left' | 'right'
}

interface DragListContext {
  bind: ReturnType<typeof useGesture>
  onto: Onto | null
}

const DraggableListContext = createContext<DragListContext | null>(null)

export function DraggableList({
  onSwap,
  children,
  ulProps,
  ...props
}: {
  onSwap?: (from: number, to: number) => void
  ulProps?: React.ComponentPropsWithoutRef<'ul'>
} & ComponentPropsWithoutRef<'div'>) {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLUListElement>(null)
  const getItems = () =>
    Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>('[data-drag-item]') ?? [],
    )
  const [onto, setOnto] = useState<Onto | null>(null)
  const bind = useGesture({
    onDrag: ({ args, active, xy }) => {
      if (!active) return
      setIsDragging(true)
      const items = getItems()
      const target = items.find(
        (el) => el && document.elementsFromPoint(...xy).includes(el),
      )
      if (!target) {
        setOnto(null)
        return
      }
      const rect = target.getBoundingClientRect()
      const side = xy[0] < rect.x + rect.width / 2 ? 'left' : 'right'
      setOnto({
        el: target,
        side,
      })
    },
    onDragEnd: ({ args }) => {
      setIsDragging(false)
      setOnto(null)
      if (!containerRef.current) return
      const item = args[0]
      if (!(args[0] instanceof HTMLElement)) return
      const items = getItems()
      const i: number = items.indexOf(item)
      if (onto) {
        const ontoI = items.indexOf(onto.el)
        if (ontoI === i) return
        if (onto.side === 'left' && ontoI - 1 === i) return
        if (onto.side === 'right' && ontoI + 1 === i) return
        onSwap?.(i, ontoI)
      }
    },
  })

  return (
    <div {...props} className={clsx('relative overflow-hidden', props.className)}>
      {isDragging && (
        <div className='absolute inset-y-0 left-0 z-20 -translate-x-1/2'>
          <AutoScrollPad
            whileHover={() => containerRef.current?.scrollBy({ left: -5 })}
          />
        </div>
      )}

      <ul
        ref={containerRef}
        {...ulProps}
        className={clsx('-mx-2 flex overflow-auto', ulProps?.className)}
      >
        <DraggableListContext.Provider value={{ bind, onto }}>
          {children}
        </DraggableListContext.Provider>
      </ul>

      {isDragging && (
        <div className='absolute inset-y-0 right-0 translate-x-1/2'>
          <AutoScrollPad
            whileHover={() => containerRef.current?.scrollBy({ left: 5 })}
          />
        </div>
      )}
    </div>
  )
}

const DraggableListItemContext =
  createContext<RefObject<HTMLLIElement | null> | null>(null)

export function DraggableListItem({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'li'>) {
  const ref = useRef<HTMLLIElement>(null)
  const ctx = useContext(DraggableListContext)
  if (!ctx) throw new Error('DraggableListItem must be wrapped in DraggableList')
  const { bind, onto } = ctx

  return (
    <li
      ref={ref}
      className={clsx(
        'relative shrink-0 border-indigo-300 px-2',
        onto && onto.el === ref.current && onto.side === 'left' && 'border-l-2',
        onto && onto.el === ref.current && onto.side === 'right' && 'border-r-2',
        className,
      )}
      data-drag-item
      {...props}
    >
      <DraggableListItemContext.Provider value={ref}>
        {children}
      </DraggableListItemContext.Provider>
    </li>
  )
}

export function DraggableHandler({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'button'>) {
  const ctx = useContext(DraggableListContext)
  const itemRef = useContext(DraggableListItemContext)
  if (!ctx || !itemRef)
    throw new Error('DraggableHandler must be wrapped in DraggableListItem')

  return (
    <button
      type='button'
      className={clsx('touch-none', className)}
      {...props}
      {...ctx.bind(itemRef.current)}
    >
      {children}
    </button>
  )
}

function AutoScrollPad({ whileHover }: { whileHover?: () => void }) {
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
