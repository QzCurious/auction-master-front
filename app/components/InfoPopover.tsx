import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverPanelProps,
} from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { Fragment } from 'react'

export default function InfoPopover({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <Popover as={Fragment}>
      <PopoverButton
        className={clsx(
          'inline-block rounded-full align-text-top text-zinc-400 transition-colors data-[open]:text-indigo-500',
          className,
        )}
      >
        <InformationCircleIcon className='size-5' />
      </PopoverButton>
      {children}
    </Popover>
  )
}

export function InfoPopoverPanel({
  children,
  className,
  ...props
}: Omit<PopoverPanelProps, 'children'> & {
  children: React.ReactNode
}) {
  return (
    <PopoverPanel
      anchor='top start'
      transition
      className={clsx(
        'rounded border border-black/10 bg-white px-2 py-1.5 shadow-md transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:translate-y-1 data-[closed]:opacity-0 sm:text-sm',
        className,
      )}
      {...props}
    >
      <p className='sm:w-[20ic]'>{children}</p>
    </PopoverPanel>
  )
}
