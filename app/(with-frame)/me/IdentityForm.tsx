'use client'

import { database } from '@/app/address.data'
import { CONSIGNOR_STATUS_MAP } from '@/app/api/frontend/configs.data'
import { applyVerification } from '@/app/api/frontend/consignor/applyVerification'
import { Consignor } from '@/app/api/frontend/consignor/getConsignor'
import { updateVerification } from '@/app/api/frontend/consignor/updateVerification'
import { Button } from '@/app/catalyst-ui/button'
import { ErrorMessage, Field, Label } from '@/app/catalyst-ui/fieldset'
import { Input } from '@/app/catalyst-ui/input'
import { Listbox, ListboxLabel, ListboxOption } from '@/app/catalyst-ui/listbox'
import { InformationCircleIcon, PhotoIcon } from '@heroicons/react/20/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

export default function IdentityForm({ consignor }: { consignor: Consignor }) {
  return (
    <div
      id='identity-form'
      className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'
    >
      <div>
        <h2 className='flex items-center gap-x-2 font-medium leading-6 text-gray-900'>
          身份認證
          {consignor.status === CONSIGNOR_STATUS_MAP.EnabledStatus && (
            <span className='inline-block rounded-md bg-green-100 py-1 pl-1 pr-2 text-xs font-medium text-green-700'>
              已完成
            </span>
          )}
        </h2>
        {consignor.status !== CONSIGNOR_STATUS_MAP.EnabledStatus && (
          <p className='mt-1 text-sm leading-6 text-gray-400'>
            完成身份認證即可開始托售物品
          </p>
        )}
      </div>

      <div className='md:col-span-2'>
        {consignor.askingVerification ? (
          <div className='rounded-md bg-blue-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <InformationCircleIcon
                  className='h-5 w-5 text-blue-400'
                  aria-hidden='true'
                />
              </div>
              <div className='ml-3 flex-1 md:flex md:justify-between'>
                <p className='text-sm text-blue-700'>身份認證審核中，請耐心等候</p>
              </div>
            </div>
          </div>
        ) : (
          <Form consignor={consignor} />
        )}
      </div>
    </div>
  )
}

const Schema = z.object({
  identificationPhoto: z
    .instanceof(File, { message: '必填' })
    .refine((file) => file.size <= 20 * 1024 * 1024, { message: '上限 20MB' })
    .optional(),
  name: z.string().min(1, { message: '必填' }),
  identification: z.string().min(1, { message: '必填' }),
  phone: z.string().min(1, { message: '必填' }),
  bankCode: z.string().min(1, { message: '必填' }),
  bankAccount: z.string().min(1, { message: '必填' }),
  city: z.string().min(1, { message: '必填' }),
  district: z.string().min(1, { message: '必填' }),
  streetAddress: z.string().min(1, { message: '必填' }),
})

function Form({ consignor }: { consignor: Consignor }) {
  const defaultValues = useMemo(
    () => ({
      ...consignor,
      name: '',
      identification: '',
      city: '',
      district: '',
      streetAddress: '',
    }),
    [consignor],
  )
  const {
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
    setError,
    setValue,
    reset,
  } = useForm<z.infer<typeof Schema>>({
    defaultValues,
    resolver: zodResolver(Schema),
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <form
      onSubmit={handleSubmit(async (_, e) => {
        const formData = new FormData(e?.target)
        if (consignor.status === CONSIGNOR_STATUS_MAP.EnabledStatus) {
          const res = await updateVerification(formData)
          if (res.error === '1003') {
            toast.error('請重新登入')
            return
          }
          if (res.error === '1005') {
            setError('name', { message: '姓名稱有誤' })
            return
          }
          if (res.error === '1006') {
            setError('identification', { message: '身份證字號有誤' })
            return
          }

          toast.success('更新申請已送出')
        } else {
          const res = await applyVerification(formData)
          if (res.error === '1003') {
            toast.error('請重新登入')
            return
          }

          toast.success('身份認證申請已送出')
        }
      })}
    >
      <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
        {consignor.status !== CONSIGNOR_STATUS_MAP.EnabledStatus && (
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
                              支援 PNG, JPG, JPEG
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
                    accept='image/*'
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
            <Field className='sm:col-span-3'>
              <Label>姓名</Label>
              <Input type='text' autoComplete='name' {...field} />
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

        <div className='sm:col-span-3'>{/* empty */}</div>

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
          name='city'
          control={control}
          render={({ field: { ref, onBlur, ...field }, fieldState }) => (
            <Field className='sm:col-span-2'>
              <Label>縣市</Label>
              {/* @ts-ignore */}
              <Listbox
                {...field}
                onChange={(v) => {
                  field.onChange(v)
                  setValue('district', '')
                }}
              
              >
                {Object.keys(database).map((v) => (
                  <ListboxOption key={v} value={v} >
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
      </div>

      <div className='mt-8 flex'>
        <Button type='submit' color='indigo' loading={isSubmitting}>
          {consignor.status ===
          CONSIGNOR_STATUS_MAP.AwaitingVerificationCompletionStatus
            ? '送出'
            : '更新'}
        </Button>
      </div>
    </form>
  )
}
