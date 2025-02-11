'use client'
import { CreateConsignorVerification } from '@/api/frontend/consignor/CreateConsignorVerification'
import { Consignor } from '@/api/frontend/consignor/GetConsignor'
import { Configs } from '@/api/frontend/GetConfigs'
import { Button } from '@/catalyst-ui/button'
import { Checkbox, CheckboxField } from '@/catalyst-ui/checkbox'
import {
  Description,
  ErrorMessage,
  Field,
  Fieldset,
  Label,
  Legend,
} from '@/catalyst-ui/fieldset'
import { Input } from '@/catalyst-ui/input'
import { Listbox, ListboxLabel, ListboxOption } from '@/catalyst-ui/listbox'
import { Text } from '@/catalyst-ui/text'
import { useHandleApiError } from '@/domain/api/HandleApiError'
import { database } from '@/domain/static/address.data'
import { DATE_FORMAT } from '@/domain/static/static'
import { CONSIGNOR_STATUS } from '@/domain/static/static-config-mappers'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { InformationCircleIcon, PhotoIcon } from '@heroicons/react/20/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import Link from 'next/link'
import { Fragment } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

export default function IdentityForm({
  consignor,
  configs,
}: {
  consignor: Consignor
  configs: Configs
}) {
  return (
    <div>
      {consignor.status ===
        CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus') && (
        <section
          id='identity-form-alert'
          className='mb-4 rounded-md bg-blue-50 p-4 sm:text-sm'
        >
          <div className='flex shrink-0 items-center gap-x-3'>
            <InformationCircleIcon
              aria-hidden='true'
              className='h-5 w-5 shrink-0 text-blue-400'
            />
            <h3 className='font-medium text-blue-700'>
              {consignor.verification ? (
                <>身份認證審核中，請耐心等候</>
              ) : (
                <>請完成身份認證</>
              )}
            </h3>
          </div>

          <div className='ml-8 mt-2'>
            <div className='text-blue-800'>
              <div className='mt-4 sm:mt-2'></div>
              <p className='leading-tight'>
                {consignor.verification ? (
                  <>
                    已加入我們的官方 Line 嗎? 請加入後傳送您的暱稱{' '}
                    {consignor.nickname} 給我們，這也是審核確認的一部分哦~
                  </>
                ) : (
                  <>
                    {/* TODO: 改成資料使用範圍、如何保密 */}
                    請同步加入我們的
                    <Link
                      href={configs.lineURL}
                      className='text-link'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      官方 Line
                    </Link>
                    ，並傳送您的暱稱 {consignor.nickname} 給我們。
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      <div
        id='identity-form'
        className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'
      >
        <div>
          <h2 className='flex items-center gap-x-2 font-medium leading-6 text-gray-900'>
            身份認證
            {consignor.status === CONSIGNOR_STATUS.enum('EnabledStatus') && (
              <span className='inline-block rounded-md bg-green-100 py-1 pl-1 pr-2 text-xs font-medium text-green-700'>
                已完成
              </span>
            )}
          </h2>
          {consignor.status !== CONSIGNOR_STATUS.enum('EnabledStatus') && (
            <p className='mt-1 text-sm leading-6 text-gray-400'>
              完成身份認證即可開始期約金額收購物品
            </p>
          )}
        </div>

        <div className='md:col-span-2'>
          {consignor.status === CONSIGNOR_STATUS.enum('EnabledStatus') ? (
            <ConsignorInfoDescriptionList data={consignor} />
          ) : consignor.verification ? (
            <ConsignorInfoDescriptionList data={consignor.verification} />
          ) : (
            <Form configs={configs} consignor={consignor} />
          )}
        </div>
      </div>
    </div>
  )
}

function ConsignorInfoDescriptionList({
  data,
}: {
  data: Pick<
    Consignor,
    | 'name'
    | 'gender'
    | 'birthday'
    | 'identification'
    | 'phone'
    | 'beneficiaryName'
    | 'bankCode'
    | 'bankAccount'
    | 'city'
    | 'district'
    | 'streetAddress'
  >
}) {
  return (
    <dl className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6 sm:gap-x-0'>
      <div className='sm:col-span-6'>
        <dt className='text-sm font-medium leading-6 text-gray-900'>姓名</dt>
        <dd className='mt-1 text-sm leading-6 text-gray-700'>{data.name}</dd>
      </div>

      <div className='sm:col-span-3'>
        <dt className='text-sm font-medium leading-6 text-gray-900'>性別</dt>
        <dd className='mt-1 text-sm leading-6 text-gray-700'>
          {data.gender === 1 ? '男' : '女'}
        </dd>
      </div>
      <div className='sm:col-span-3'>
        <dt className='text-sm font-medium leading-6 text-gray-900'>生日</dt>
        <dd className='mt-1 text-sm leading-6 text-gray-700'>
          {format(new Date(data.birthday), DATE_FORMAT)}
        </dd>
      </div>

      <div className='sm:col-span-3'>
        <dt className='text-sm font-medium leading-6 text-gray-900'>身分證字號</dt>
        <dd className='mt-1 text-sm leading-6 text-gray-700'>
          {data.identification}
        </dd>
      </div>
      <div className='sm:col-span-3'>
        <dt className='text-sm font-medium leading-6 text-gray-900'>手機號碼</dt>
        <dd className='mt-1 text-sm leading-6 text-gray-700'>{data.phone}</dd>
      </div>

      <div className='sm:col-span-3'>
        <dt className='text-sm font-medium leading-6 text-gray-900'>銀行帳戶</dt>
        <dd className='mt-1 text-sm leading-6 text-gray-700'>
          ({data.bankCode}) {data.bankAccount}
        </dd>
      </div>
      <div className='sm:col-span-3'>
        <dt className='text-sm font-medium leading-6 text-gray-900'>銀行戶名</dt>
        <dd className='mt-1 text-sm leading-6 text-gray-700'>
          {data.beneficiaryName}
        </dd>
      </div>

      <div className='sm:col-span-3'>
        <dt className='text-sm font-medium leading-6 text-gray-900'>地址</dt>
        <dd className='mt-1 text-sm leading-6 text-gray-700'>
          {data.city} {data.district} {data.streetAddress}
        </dd>
      </div>
    </dl>
  )
}

const Schema = z.object({
  identificationPhoto: z
    .instanceof(File, { message: '必填' })
    .refine((file) => file.size <= 20 * 1024 * 1024, { message: '上限 20MB' })
    .refine((file) => file.type === 'image/jpeg' || file.type === 'image/png', {
      message: '請上傳 JPG, PNG 格式圖片',
    }),
  name: z.string().min(1, { message: '必填' }),
  identification: z.string().min(1, { message: '必填' }),
  gender: z.number().refine((v) => v === 1 || v === 2, { message: '必填' }),
  birthday: z.coerce.date({ errorMap: () => ({ message: '必填' }) }),
  city: z.string().min(1, { message: '必填' }),
  district: z.string().min(1, { message: '必填' }),
  streetAddress: z.string().min(1, { message: '必填' }),
  phone: z.string().min(1, { message: '必填' }),
  beneficiaryName: z.string().min(1, { message: '必填' }),
  bankCode: z.string().min(1, { message: '必填' }),
  bankAccount: z.string().min(1, { message: '必填' }),
  lineAdded: z.boolean().refine((v) => v === true, { message: '請確認完成後勾選' }),
})

function Form({ configs, consignor }: { configs: Configs; consignor: Consignor }) {
  const {
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<z.output<typeof Schema>>({
    defaultValues: {
      name: '',
      identification: '',
      gender: 0 as any,
      birthday: '' as any,
      city: '',
      district: '',
      streetAddress: '',
      phone: '',
      beneficiaryName: '',
      bankCode: '',
      bankAccount: '',
      lineAdded: false,
    },
    resolver: zodResolver(Schema),
  })
  const handleApiError = useHandleApiError()

  return (
    <form
      onSubmit={handleSubmit(async (data, e) => {
        const formData = new FormData(e?.target)
        formData.append('birthday', data.birthday.toISOString())
        const res = await CreateConsignorVerification(formData)
        if (res.error) {
          handleApiError(res.error)
          return
        }

        toast.success('身份認證申請已送出')
      })}
    >
      <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
        {consignor.status !== CONSIGNOR_STATUS.enum('EnabledStatus') && (
          <Controller
            name='identificationPhoto'
            control={control}
            render={({ field, fieldState }) => {
              const src = field.value ? URL.createObjectURL(field.value) : null
              return (
                <div className='sm:col-span-full'>
                  <label
                    htmlFor='identificationPhoto'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    身份證照片
                  </label>
                  <div className='mt-2'>
                    <label htmlFor='identificationPhoto'>
                      {src ? (
                        <img src={src} className='rounded-md' alt='' />
                      ) : (
                        <div className='flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
                          <div className='text-center'>
                            <PhotoIcon
                              className='mx-auto h-12 w-12 text-gray-300'
                              aria-hidden='true'
                            />
                            <p className='text-xs leading-5 text-gray-600'>
                              支援 PNG, JPG
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  <input
                    id='identificationPhoto'
                    hidden
                    type='file'
                    accept='image/png, image/jpeg, image/jpg'
                    {...field}
                    value={undefined}
                    onChange={(e) => {
                      src && URL.revokeObjectURL(src)
                      const f = e.target.files?.item(0)
                      field.onChange(f)
                    }}
                  />
                  {fieldState.error && (
                    <p className='mt-1 text-sm text-red-600'>
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )
            }}
          />
        )}

        <Controller
          name='name'
          control={control}
          render={({ field, fieldState }) => (
            <Field className='sm:col-span-2'>
              <Label>姓名</Label>
              <Input type='text' autoComplete='name' {...field} />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          name='gender'
          control={control}
          render={({ field: { ref, onBlur, ...field }, fieldState }) => (
            <Field className='min-w-min sm:col-span-1'>
              <Label>性別</Label>
              <Listbox {...field}>
                <ListboxOption value={1}>
                  <ListboxLabel>男</ListboxLabel>
                </ListboxOption>
                <ListboxOption value={2}>
                  <ListboxLabel>女</ListboxLabel>
                </ListboxOption>
              </Listbox>
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          name='birthday'
          control={control}
          render={({ field, fieldState }) => (
            <Field className='sm:col-span-2'>
              <Label>生日</Label>
              <Popover as={Fragment}>
                <PopoverButton
                  as={Input}
                  type='text'
                  readOnly
                  value={field.value ? format(field.value, DATE_FORMAT) : ''}
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
                      mode='single'
                      captionLayout='dropdown-buttons'
                      selected={field.value}
                      onSelect={(v) => {
                        field.onChange(v)
                        close()
                      }}
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear()}
                    />
                  )}
                </PopoverPanel>
              </Popover>
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          name='identification'
          control={control}
          render={({ field, fieldState }) => (
            <Field className='sm:col-span-3'>
              <Label>身分證字號</Label>
              <Input type='text' autoComplete='' {...field} />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          name='phone'
          control={control}
          render={({ field, fieldState }) => (
            <Field className='sm:col-span-3'>
              <Label>手機號碼</Label>
              <Input type='text' autoComplete='mobile tel' {...field} />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          name='bankCode'
          control={control}
          render={({ field, fieldState }) => (
            <Field className='sm:col-span-2'>
              <Label>銀行代碼</Label>
              <Input type='text' autoComplete='off' {...field} />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          name='bankAccount'
          control={control}
          render={({ field, fieldState }) => (
            <Field className='sm:col-span-4'>
              <Label>銀行戶號</Label>
              <Input type='text' autoComplete='off' {...field} />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          name='beneficiaryName'
          control={control}
          render={({ field, fieldState }) => (
            <Field className='sm:col-span-3'>
              <Label>銀行戶名</Label>
              <Input type='text' autoComplete='off' {...field} />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <div className='sm:col-span-3' />

        <Controller
          name='city'
          control={control}
          render={({ field: { ref, onBlur, ...field }, fieldState }) => (
            <Field className='sm:col-span-2'>
              <Label>縣市</Label>
              <Listbox
                {...field}
                onChange={(v) => {
                  field.onChange(v)
                  setValue('district', '')
                }}
              >
                {Object.keys(database).map((v) => (
                  <ListboxOption key={v} value={v}>
                    <ListboxLabel>{v}</ListboxLabel>
                  </ListboxOption>
                ))}
              </Listbox>

              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          name='district'
          control={control}
          render={({ field: { ref, onBlur, ...field }, fieldState }) => (
            <Field className='sm:col-span-2'>
              <Label>區域</Label>
              <Listbox {...field} disabled={!watch('city')}>
                {watch('city') &&
                  Object.keys(database[watch('city') as keyof typeof database]).map(
                    (v) => (
                      <ListboxOption key={v} value={v}>
                        <ListboxLabel>{v}</ListboxLabel>
                      </ListboxOption>
                    ),
                  )}
              </Listbox>
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          name='streetAddress'
          control={control}
          render={({ field, fieldState }) => (
            <Field className='sm:col-span-5'>
              <Label>地址</Label>
              <Input type='text' autoComplete='street-address' {...field} />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          control={control}
          name='lineAdded'
          render={({ field, fieldState }) => (
            <Fieldset className='col-span-full'>
              <Legend>加入官方 LINE</Legend>
              <Text>
                請同步加入我們的
                <Link
                  href={configs.lineURL}
                  className='text-link text-indigo-500 hover:text-indigo-600'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  官方 Line
                </Link>
                ，並傳送您的暱稱{' '}
                <span className='text-indigo-500'>{consignor.nickname}</span> 給我們。
              </Text>
              <CheckboxField className='mt-2 !gap-x-3'>
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(v) => field.onChange(v)}
                />
                <Label>我已經加入官方 LINE 並傳送暱稱</Label>
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
              </CheckboxField>
            </Fieldset>
          )}
        />
      </div>

      <div className='mt-8 flex'>
        <Button type='submit' color='indigo' loading={isSubmitting}>
          {consignor.status ===
          CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus')
            ? '送出'
            : '更新'}
        </Button>
      </div>
    </form>
  )
}
