'use client'

import { ITEM_STATUS_MAP, ITEM_TYPE_MAP } from '@/app/api/frontend/configs.data'
import { changeItemPhotoSort } from '@/app/api/frontend/items/changeItemPhotoSort'
import { createItem } from '@/app/api/frontend/items/createItem'
import { deleteItemPhoto } from '@/app/api/frontend/items/deleteItemPhoto'
import { Item } from '@/app/api/frontend/items/getItem'
import { itemAppraisal } from '@/app/api/frontend/items/itemAppraisal'
import { updateItem } from '@/app/api/frontend/items/updateItem'
import { uploadItemPhotos } from '@/app/api/frontend/items/uploadItemPhotos'
import ErrorAlert from '@/app/components/alerts/ErrorAlert'
import { PlusIcon } from '@heroicons/react/24/outline'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useTransition } from 'react'
import {
  Control,
  Controller,
  useController,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import ImageItem from '../ImageItem'

const Schema = z.object({
  name: z.string().min(1, { message: '必填' }),
  type: z.number(),
  reservePrice: z.number({ message: '必填' }),
  photos: z
    .array(
      z.union([
        z.object({ photo: z.string(), sorted: z.number() }),
        z
          .instanceof(File)
          .refine((file) => file.size <= 20 * 1024 * 1024, { message: '上限 20MB' }),
      ]),
    )
    .min(1, { message: '必填' })
    .max(30, { message: '上限 30 張' }),
})

interface ItemFormProps {
  item?: Item
}

export default function ItemForm({ item }: ItemFormProps) {
  const defaultValues = useMemo(
    () => ({
      name: item?.name ?? '',
      type: item?.type ?? 0,
      reservePrice: item?.reservePrice ?? ('' as any),
      photos: item?.photos ?? [],
    }),
    [item?.name, item?.photos, item?.reservePrice, item?.type],
  )
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm<z.input<typeof Schema>>({
    defaultValues,
    resolver: zodResolver(Schema),
  })
  const router = useRouter()

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <div>
      {errors.root?.message && <ErrorAlert message={errors.root.message} />}
      <form
        className='col-span-7 mt-10'
        onSubmit={handleSubmit(
          item
            ? async (data) => {
                {
                  const res = await updateItem(item.id, {
                    name: data.name,
                    type: data.type,
                    reservePrice: data.reservePrice,
                    description: '',
                  })
                  if (res.error) {
                    setError('root', {
                      message: `Failed to update item: ${res.error}`,
                    })
                    return
                  }
                }
                toast.success('更新成功')
              }
            : async (data) => {
                const formData = new FormData()
                formData.append('name', data.name)
                formData.append('type', data.type.toString())
                formData.append('reservePrice', data.reservePrice.toString())
                for (let i = 0; i < data.photos.length; i++) {
                  const f = data.photos[i]
                  if (f instanceof File) {
                    formData.append('photo', f)
                    formData.append('sorted', `${i + 1}`)
                  }
                }
                const res = await createItem(formData)
                if (res.error) {
                  setError('root', { message: `Failed to create item: ${res.error}` })
                  return
                }
                toast.success('新增成功')
                router.push('/items/draft')
              },
        )}
      >
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <div className='col-span-full'>
                <div className='flex items-center gap-x-2'>
                  <input
                    id='type'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                    {...field}
                    checked={field.value === ITEM_TYPE_MAP.FixedPriceItemType}
                    onChange={(e) => {
                      field.onChange(
                        e.target.checked ? ITEM_TYPE_MAP.FixedPriceItemType : 0,
                      )
                    }}
                  />
                  <label htmlFor='type' className='text-gray-900'>
                    是否為定價物品
                  </label>
                </div>
              </div>
            )}
          />

          <Controller
            name='name'
            control={control}
            render={({ field, fieldState }) => (
              <div className='sm:col-span-3'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  物品名稱
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='name'
                    autoComplete='off'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                  />
                </div>
                {fieldState.error && (
                  <p className='mt-1 text-sm text-red-600'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name='reservePrice'
            control={control}
            render={({ field, fieldState }) => (
              <div className='sm:col-span-3'>
                <label
                  htmlFor='reservePrice'
                  className='block text-sm font-medium leading-6 text-gray-900'
                  title='reservePrice'
                >
                  期望價格
                </label>
                <div className='mt-2'>
                  <input
                    type='number'
                    id='reservePrice'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === '' ? '' : parseFloat(e.target.value),
                      )
                    }}
                    autoComplete='off'
                  />
                </div>
                {fieldState.error && (
                  <p className='mt-1 text-sm text-red-600'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className='col-span-full'>
            <UploadImage control={control} item={item} />
          </div>
        </div>

        <div className='mt-6 flex items-center gap-x-4'>
          <div className='mx-auto'></div>

          {process.env.NODE_ENV === 'development' && (
            <button
              type='button'
              className='text-sm font-semibold leading-6 text-gray-900'
              onClick={() => console.log(getValues())}
            >
              Log values
            </button>
          )}

          {!isDirty && item && item.status === ITEM_STATUS_MAP['InitStatus'] && (
            <AppraisalButton item={item} />
          )}

          {isDirty && (
            <button
              type='button'
              className='rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              onClick={() => reset()}
            >
              重設
            </button>
          )}

          <button
            type='submit'
            className={clsx(
              'flex rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              isSubmitting && 'pointer-events-none opacity-50',
            )}
          >
            {isSubmitting && (
              <span className='mr-2 size-3 animate-spin self-center rounded-full border-2 border-l-0 border-indigo-200'></span>
            )}
            送出
          </button>
        </div>
      </form>
    </div>
  )
}

function AppraisalButton({ item }: { item: Item }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <button
      type='button'
      className='rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
      onClick={() => {
        startTransition(async () => {
          await itemAppraisal(item.id)
          toast.success('審核已提交')
          router.push('/items/appraising')
        })
      }}
    >
      {isPending && (
        <span className='mr-2 inline-block size-3 animate-spin self-center rounded-full border-2 border-l-0 border-gray-300'></span>
      )}
      提交估價
    </button>
  )
}

function UploadImage({
  control,
  item,
}: {
  control: Control<z.input<typeof Schema>>
  item?: Item
}) {
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'photos',
  })
  const { formState } = useController({
    control,
    name: 'photos',
  })
  const [isPending, startTransition] = useTransition()

  return (
    <div className='relative'>
      {isPending && (
        <div className='pointer-events-none absolute inset-0 z-10 animate-pulse rounded bg-black opacity-40' />
      )}

      <label htmlFor='file-upload' className='inline-flex items-center gap-x-2'>
        <span className='text-sm font-medium leading-6 text-gray-900'>
          物品圖片 {item && <span className='text-gray-500'>(自動儲存)</span>}
        </span>
        <PlusIcon className='h-5 w-5 rounded bg-indigo-500 p-0.5 text-white hover:bg-indigo-400' />
        <input
          id='file-upload'
          name='file-upload'
          type='file'
          hidden
          multiple
          onChange={
            item
              ? async (e) => {
                  const files = e.target.files
                  if (!files) return
                  const formData = new FormData()
                  for (let i = 0; i < files.length; i++) {
                    formData.append('photo', files[i])
                    formData.append('sorted', `${i + item.photos.length + 1}`)
                  }
                  startTransition(async () => {
                    await uploadItemPhotos(item.id, formData)
                    for (const f of Array.from(files)) {
                      append(f)
                    }
                  })
                }
              : (e) => {
                  const files = e.target.files
                  if (!files) return
                  for (const f of Array.from(files)) {
                    append(f)
                  }
                }
          }
        />
      </label>
      {fields.length === 0 ? (
        <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
          <div className='text-center'>
            <PhotoIcon
              className='mx-auto h-12 w-12 text-gray-300'
              aria-hidden='true'
            />
            <p className='mt-2 text-xs leading-5 text-gray-600'>
              支援 PNG, JPG, JPEG
            </p>
          </div>
        </div>
      ) : (
        <div className='overflow-x-auto px-1 pb-3 pt-2'>
          <ul role='list' className='flex gap-x-4'>
            {fields.map((field, i) => (
              <li key={field.id}>
                <Controller
                  control={control}
                  name={`photos.${i}`}
                  render={({ field, fieldState }) => (
                    <ImageItem
                      src={'photo' in field.value ? field.value.photo : field.value}
                      error={fieldState.error?.message}
                      onDelete={
                        item
                          ? async () => {
                              startTransition(async () => {
                                await deleteItemPhoto(item.id, i + 1)
                                remove(i)
                              })
                            }
                          : () => remove(i)
                      }
                      onMoveUp={
                        i === 0
                          ? false
                          : item
                            ? async () => {
                                startTransition(async () => {
                                  await changeItemPhotoSort(item.id, {
                                    originalSorted: i + 1,
                                    newSorted: i,
                                  })
                                  move(i, i - 1)
                                })
                              }
                            : () => move(i, i - 1)
                      }
                      onMoveDown={
                        i === fields.length - 1
                          ? false
                          : item
                            ? async () => {
                                startTransition(async () => {
                                  await changeItemPhotoSort(item.id, {
                                    originalSorted: i + 1,
                                    newSorted: i + 2,
                                  })
                                  move(i, i + 1)
                                })
                              }
                            : () => move(i, i + 1)
                      }
                    />
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className='mt-1 text-sm text-red-600'>{formState.errors.photos?.message}</p>
    </div>
  )
}
