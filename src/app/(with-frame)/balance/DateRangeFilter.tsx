'use client'

import { Field, Label } from '@/catalyst-ui/fieldset'
import { Input, InputGroup } from '@/catalyst-ui/input'
import { DATE_FORMAT, PAGE } from '@/domain/static/static'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { addMonths, endOfDay, format, startOfDay, subMonths } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { useRouter, useSearchParams } from 'next/navigation'
import { Fragment, useEffect, useRef, useState } from 'react'
import { DateRange, DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function DateRangeFilter({
  startAt,
  endAt,
  zIndex,
  canCancel = false,
}: {
  startAt?: Date
  endAt?: Date
  zIndex?: number
  canCancel?: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startAt,
    to: endAt,
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
              startAt && endAt
                ? format(startAt, DATE_FORMAT) + ' ~ ' + format(endAt, DATE_FORMAT)
                : ''
            }
          />
          {canCancel && startAt && endAt && (
            <button
              type='button'
              data-slot='icon'
              className='!pointer-events-auto'
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams)
                newSearchParams.delete('startAt')
                newSearchParams.delete('endAt')
                newSearchParams.delete(PAGE)
                router.replace(`?${newSearchParams.toString()}`)
              }}
            >
              <XMarkIcon
                className='size-9 -translate-x-2 -translate-y-2 p-2 sm:size-5 sm:-translate-x-0.5 sm:-translate-y-0.5 sm:p-0'
                data-slot=''
              />
              <span className='sr-only'>清除區間篩選</span>
            </button>
          )}
        </InputGroup>
        <PopoverPanel
          anchor='bottom start'
          transition
          style={{ zIndex }}
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
                  action={() => setDateRange({ from: startAt, to: endAt })}
                />
              }
              <DayPicker
                locale={zhTW}
                weekStartsOn={0}
                defaultMonth={dateRange?.from}
                mode='range'
                captionLayout='dropdown-buttons'
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
                  newSearchParams.set('startAt', startOfDay(r.from).toISOString())
                  newSearchParams.set('endAt', endOfDay(r.to).toISOString())
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
