'use client'

import { Button } from '@/catalyst-ui/button'
import { Subheading } from '@/catalyst-ui/heading'
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import clsx from 'clsx'
import React, { useTransition } from 'react'

interface DoubleCheckPopoverProps {
  title: string | React.ReactNode
  description?: string | React.ReactNode
  children: React.ReactNode
  onConfirm: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
}

export function DoubleCheckPopover({
  title,
  description,
  children,
  onConfirm,
  onCancel,
}: DoubleCheckPopoverProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <Popover className='relative'>
      {children}

      <PopoverPanel
        anchor='bottom start'
        transition
        className={clsx(
          'mt-1 flex flex-col rounded-lg bg-white px-4 py-3 shadow-lg',
          'transition duration-100 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in sm:data-[closed]:translate-y-0 sm:data-[closed]:data-[enter]:scale-95',
        )}
      >
        <Subheading level={3}>{title}</Subheading>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          {description}
        </p>

        <div className='mt-2 flex gap-x-4'>
          <CloseButton
            as={Button}
            outline
            className='h-9 min-w-20'
            onClick={() => onCancel?.()}
          >
            取消
          </CloseButton>
          <Button
            loading={isPending}
            color='indigo'
            className='h-9 min-w-20'
            onClick={() => {
              startTransition(async () => onConfirm())
            }}
          >
            確定
          </Button>
        </div>
      </PopoverPanel>
    </Popover>
  )
}

export const DoubleCheckPopoverButton = PopoverButton
