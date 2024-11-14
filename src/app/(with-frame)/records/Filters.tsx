'use client'

import { RECORD_STATUS, RECORD_TYPE } from '@/domain/static/static-config-mappers'
import { Field, Label } from '@/catalyst-ui/fieldset'
import { Input } from '@/catalyst-ui/input'
import { Text } from '@/catalyst-ui/text'
import { DATE_FORMAT } from '@/domain/static/static'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { format, startOfDay, subDays, subHours } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { useRouter, useSearchParams } from 'next/navigation'
import { Fragment, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import * as R from 'remeda'
import { z } from 'zod'
import DateRangeFilter from '../balance/DateRangeFilter'
import { SearchParamsSchema } from './SearchParamsSchema'

export function DateRange() {
  const [endAt, setEndAt] = useState(() => subHours(new Date(), 1))
  const [startAt, setStartAt] = useState(() => startOfDay(subDays(endAt, 7)))

  return (
    <Field className='sm:col-span-2'>
      <Label>區間</Label>
      <Popover as={Fragment}>
        <PopoverButton
          as={Input}
          type='text'
          readOnly
          value={format(startAt, DATE_FORMAT) + ' - ' + format(endAt, DATE_FORMAT)}
        />
        <PopoverPanel
          anchor='bottom start'
          transition
          className={clsx(
            'mt-0.5 rounded-lg bg-white shadow-lg',
            'transition duration-100 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in sm:data-[closed]:translate-y-0 sm:data-[closed]:data-[enter]:scale-95',
          )}
        >
          {({ close }) => (
            <DayPicker
              locale={zhTW}
              weekStartsOn={0}
              mode='range'
              captionLayout='dropdown-buttons'
              selected={{ from: startAt, to: endAt }}
              onSelect={(v) => {
                v?.from && setStartAt(v.from)
                v?.to && setEndAt(v.to)
                if (v?.from && v?.to) close()
              }}
              fromYear={new Date().getFullYear() - 100}
              toYear={new Date().getFullYear()}
            />
          )}
        </PopoverPanel>
      </Popover>
    </Field>
  )
}

const filters = {
  type: {
    label: '類型',
    options: R.map(
      [
        RECORD_TYPE.data[0],
        RECORD_TYPE.data[1],
        RECORD_TYPE.data[2],
        RECORD_TYPE.data[3],
        RECORD_TYPE.data[4],
        RECORD_TYPE.data[5],
        RECORD_TYPE.data[6],
        RECORD_TYPE.data[7],
        RECORD_TYPE.data[8],
      ],
      ({ value, message }) => ({ label: message, value }),
    ),
  },
  status: {
    label: '狀態',
    options: R.map(
      [
        RECORD_STATUS.data[0],
        RECORD_STATUS.data[1],
        RECORD_STATUS.data[2],
        RECORD_STATUS.data[3],
      ],
      ({ value, message }) => ({ label: message, value }),
    ),
  },
} as const

filters.type.options.length satisfies typeof RECORD_TYPE.data.length
filters.status.options.length satisfies typeof RECORD_STATUS.data.length

type FilterProps = Pick<
  z.output<typeof SearchParamsSchema>,
  'startAt' | 'endAt' | 'type' | 'status'
>

function DesktopCheckboxGroup<T extends string | number>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: Array<{ value: T; label: string }>
  selected: T[]
  onChange: (value: T[]) => void
}) {
  return (
    <fieldset>
      <legend className='block text-sm font-medium text-gray-900'>{label}</legend>
      <div className='space-y-3 pt-6'>
        {options.map((option) => (
          <div key={option.value} className='flex items-center'>
            <input
              id={option.value.toString()}
              value={option.value}
              checked={selected.includes(option.value)}
              type='checkbox'
              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              onChange={(e) => {
                onChange(
                  e.target.checked
                    ? [...selected, option.value]
                    : selected.filter((v) => v !== option.value),
                )
              }}
            />
            <label htmlFor={option.value.toString()} className={clsx('ml-3 text-sm')}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

export function DesktopFilters(props: FilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className='hidden min-w-fit lg:block'>
      <DateRangeFilter startAt={props.startAt} endAt={props.endAt} />
      <form className='mt-6 space-y-10 divide-y divide-gray-200'>
        {R.entries(filters).map(([field, section], sectionIdx) => (
          <div key={section.label} className={clsx(sectionIdx !== 0 && 'pt-10')}>
            <DesktopCheckboxGroup
              label={section.label}
              options={section.options}
              selected={props[field]}
              onChange={(value) => {
                const newSearch = new URLSearchParams(searchParams)
                newSearch.delete(field)
                value.forEach((v) => newSearch.append(field, v.toString()))
                router.replace(`?${newSearch.toString()}`)
              }}
            />
          </div>
        ))}
      </form>
    </div>
  )
}

function MobileCheckboxGroup<T extends string | number>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: Array<{ value: T; label: string }>
  selected: T[]
  onChange: (value: T[]) => void
}) {
  return (
    <Disclosure as='div' className='border-t border-gray-200 pb-4 pt-4' defaultOpen>
      {({ open }) => (
        <fieldset>
          <legend className='w-full px-2'>
            <DisclosureButton className='flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500'>
              <span className='text-sm font-medium text-gray-900'>{label}</span>
              <span className='ml-6 flex h-7 items-center'>
                <ChevronDownIcon
                  className={clsx(
                    open ? '-rotate-180' : 'rotate-0',
                    'h-5 w-5 transform',
                  )}
                  aria-hidden='true'
                />
              </span>
            </DisclosureButton>
          </legend>
          <DisclosurePanel className='px-4 pb-2 pt-4'>
            <div className='space-y-6'>
              {options.map((option) => (
                <div key={option.value} className='flex items-center'>
                  <input
                    id={option.value.toString()}
                    value={option.value}
                    checked={selected.includes(option.value)}
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                    onChange={(e) => {
                      onChange(
                        e.target.checked
                          ? [...selected, option.value]
                          : selected.filter((v) => v !== option.value),
                      )
                    }}
                  />
                  <label
                    htmlFor={option.value.toString()}
                    className={clsx('ml-3 text-sm')}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </fieldset>
      )}
    </Disclosure>
  )
}

export function MobileFilters(props: FilterProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <>
      <button
        type='button'
        className='relative inline-flex items-center gap-x-1 lg:hidden'
        onClick={() => setMobileFiltersOpen(true)}
      >
        <FunnelIcon
          className={clsx(
            'h-5 w-5 flex-shrink-0',
            Object.values(props).flat().length === 0
              ? 'text-gray-400'
              : 'fill-indigo-600 text-indigo-600',
          )}
          aria-hidden='true'
        />
        <Text className='font-medium'>篩選條件</Text>
      </button>

      <Dialog
        className='relative z-40 lg:hidden'
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}
      >
        <DialogBackdrop
          transition
          className='fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0'
        />

        <div className='fixed inset-0 z-40 flex'>
          <DialogPanel
            transition
            className='relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full'
          >
            <div className='flex items-center justify-between px-4'>
              <h2 className='text-lg font-medium text-gray-900'>篩選條件</h2>
              <button
                type='button'
                className='-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500'
                onClick={() => setMobileFiltersOpen(false)}
              >
                <span className='sr-only'>Close menu</span>
                <XMarkIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>

            {/* Filters */}
            <div className='my-4 px-4'>
              <DateRangeFilter
                // canCancel
                zIndex={50}
                startAt={props.startAt}
                endAt={props.endAt}
              />
            </div>

            <form className='mt-4'>
              {R.entries(filters).map(([field, section]) => (
                <MobileCheckboxGroup
                  key={section.label}
                  label={section.label}
                  options={section.options}
                  selected={props[field]}
                  onChange={(value) => {
                    const newSearch = new URLSearchParams(searchParams)
                    newSearch.delete(field)
                    value.forEach((v) => newSearch.append(field, v.toString()))
                    router.replace(`?${newSearch.toString()}`)
                  }}
                />
              ))}
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
