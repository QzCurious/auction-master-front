'use client'

import { Field, Label } from '@/app/catalyst-ui/fieldset'
import { Input, InputGroup } from '@/app/catalyst-ui/input'
import { DATE_FORMAT, PAGE } from '@/app/static'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { addMonths, format, subMonths } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { useRouter, useSearchParams } from 'next/navigation'
import { Fragment, useEffect, useRef, useState } from 'react'
import { DateRange, DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function DateRangeFilter({
  start,
  end,
}: {
  start?: Date
  end?: Date
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: start,
    to: end,
  })

  return (
    <Field className='w-60 sm:w-52'>
      <Label>區間</Label>
      <Popover as={Fragment}>
        <InputGroup>
          <PopoverButton
            as={Input}
            type='text'
            readOnly
            value={
              start && end
                ? format(start, DATE_FORMAT) + ' ~ ' + format(end, DATE_FORMAT)
                : ''
            }
          />
          {start && end && (
            <button
              type='button'
              data-slot='icon'
              className='!pointer-events-auto'
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams)
                newSearchParams.delete('start')
                newSearchParams.delete('end')
                newSearchParams.delete(PAGE)
                router.replace(`?${newSearchParams.toString()}`)
              }}
            >
              <XMarkIcon
                className='size-9 -translate-x-2 -translate-y-2 p-2'
                data-slot=''
              />
              <span className='sr-only'>清除區間篩選</span>
            </button>
          )}
        </InputGroup>
        <PopoverPanel
          anchor='bottom start'
          transition
          className={clsx(
            'mt-0.5 rounded-lg bg-white shadow-lg',
            'transition duration-100 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in sm:data-[closed]:translate-y-0 sm:data-[closed]:data-[enter]:scale-95',
          )}
        >
          {({ close }) => (
            <>
              {
                // HACK: Popover don't have onClose callback
                <UnmountAction
                  action={() => setDateRange({ from: start, to: end })}
                />
              }
              <DayPicker
                locale={zhTW}
                weekStartsOn={0}
                defaultMonth={dateRange?.from}
                mode='range'
                captionLayout='dropdown'
                disabled={(day) => {
                  let cond = false
                  if (day > new Date()) {
                    cond = true
                  }
                  if (!dateRange?.to) {
                    if (dateRange?.from && day < subMonths(dateRange.from, 3)) {
                      cond = true
                    }
                    if (dateRange?.from && day > addMonths(dateRange.from, 3)) {
                      cond = true
                    }
                  }
                  return cond
                }}
                selected={dateRange}
                onSelect={(r, s) => {
                  if (dateRange?.from && dateRange?.to) {
                    setDateRange({ from: s, to: undefined })
                    return
                  }
                  setDateRange(r)

                  if (!r || !r.from || !r.to) {
                    return
                  }
                  const newSearchParams = new URLSearchParams(searchParams)
                  newSearchParams.set('start', format(r.from, DATE_FORMAT))
                  newSearchParams.set('end', format(r.to, DATE_FORMAT))
                  newSearchParams.delete(PAGE)

                  router.replace(`?${newSearchParams}`)
                  close()
                }}
                fromYear={new Date().getFullYear() - 100}
                toYear={new Date().getFullYear()}
              />
            </>
          )}
        </PopoverPanel>
      </Popover>
    </Field>
  )
}

function UnmountAction({ action }: { action: () => void }) {
  const actionRef = useRef(action)
  actionRef.current = action
  useEffect(() => () => actionRef.current(), [])
  return null
}
