'use client'

import { ConsignorDeleteItemPhoto } from '@/api/frontend/items/ConsignorDeleteItemPhoto'
import { ConsignorReorderItemPhoto } from '@/api/frontend/items/ConsignorReorderItemPhoto'
import { ConsignorUpsertItemPhoto } from '@/api/frontend/items/ConsignorUpsertItemPhoto'
import { CreateItem } from '@/api/frontend/items/CreateItem'
import { Item } from '@/api/frontend/items/GetConsignorItems'
import { UpdateConsignorItem } from '@/api/frontend/items/UpdateConsignorItem'
import { Button } from '@/catalyst-ui/button'
import { Checkbox, CheckboxField } from '@/catalyst-ui/checkbox'
import { Description, ErrorMessage, Field, Label } from '@/catalyst-ui/fieldset'
import { Input, InputGroup } from '@/catalyst-ui/input'
import ErrorAlert from '@/components/alerts/ErrorAlert'
import {
  DraggableHandler,
  DraggableList,
  DraggableListItem,
} from '@/components/DraggableList'
import InfoPopover, { InfoPopoverPanel } from '@/components/InfoPopover'
import { QuillTextEditorClientOnly } from '@/components/QuillTextEditor/QuillTextEditorClientOnly'
import { useHandleApiError } from '@/domain/api/HandleApiError'
import { appendEntries } from '@/domain/crud/appendEntries'
import { getDirtyFields } from '@/domain/crud/getDirtyFields'
import { currencySign } from '@/domain/static/static'
import { ITEM_TYPE } from '@/domain/static/static-config-mappers'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowsOutLineHorizontal } from '@phosphor-icons/react/dist/ssr/ArrowsOutLineHorizontal'
import { useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import {
  Control,
  Controller,
  useController,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

const Schema = z.object({
  name: z.string().min(1, { message: '必填' }),
  type: z.number(),
  isNew: z.boolean(),
  reservePrice: z.number({ message: '必填' }).min(1, '不可小於 1').int('請輸入整數'),
  photos: z
    .array(
      z.union([
        z.object({ sorted: z.number(), photo: z.string() }),
        z
          .object({
            file: z.instanceof(File, { message: '必填' }),
          })
          .refine(({ file }) => file.type === 'image/jpeg', {
            message: '請上傳 JPG 格式圖片',
          })
          .refine(({ file }) => file.size <= 20 * 1024 * 1024, {
            message: '上限 20MB',
          }),
      ]),
    )
    .min(1, { message: '必填' })
    .max(10, { message: '上限 10 張' }),
  description: z.string().default(''),
})

interface ItemFormProps {
  item?: Item
  jpyBuyingRate: number
}

export default function ItemForm({ item, jpyBuyingRate }: ItemFormProps) {
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors, dirtyFields, defaultValues },
  } = useForm<z.output<typeof Schema>>({
    values: {
      name: item?.name || '',
      type: item?.type || 0,
      isNew: item?.isNew || false,
      reservePrice: item?.reservePrice || ('' as any),
      photos: item?.photos || [],
      description: item?.description || '',
    },
    resolver: zodResolver(Schema),
  })
  const router = useRouter()
  const handleApiError = useHandleApiError()

  return (
    <div>
      {errors.root?.message && <ErrorAlert message={errors.root.message} />}
      <form
        className='col-span-7 mt-10'
        onSubmit={handleSubmit(
          !item
            ? async ({ photos, ...data }) => {
                const formData = new FormData()
                appendEntries(formData, data)
                for (let i = 0; i < photos.length; i++) {
                  const f = photos[i]
                  if ('file' in f) {
                    formData.append('photo', f.file)
                    formData.append('sorted', `${i + 1}`)
                  }
                }

                const res = await CreateItem(formData)
                if (res.error) {
                  handleApiError(res.error)
                  return
                }

                toast.success('新增成功')
                router.push('/items')
              }
            : async ({ photos, ...data }) => {
                const dirtyValues = getDirtyFields(data, dirtyFields)
                if (Object.keys(dirtyValues).length === 0) return

                const res = await UpdateConsignorItem(item.id, dirtyValues)
                if (res.error) {
                  handleApiError(res.error)
                  return
                }
                toast.success('更新成功')
              },
          (err) => {
            console.log(err)
          },
        )}
      >
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <div className='col-span-full flex flex-wrap gap-x-12 gap-y-4'>
            <Controller
              control={control}
              name='type'
              render={({ field: { ref, ...field } }) => (
                <CheckboxField className=''>
                  <Checkbox
                    {...field}
                    checked={field.value === ITEM_TYPE.enum('FixedPriceItemType')}
                    onChange={(v) =>
                      field.onChange(v ? ITEM_TYPE.enum('FixedPriceItemType') : 0)
                    }
                  />
                  <Label>是否為定價物品</Label>
                </CheckboxField>
              )}
            />

            <Controller
              control={control}
              name='isNew'
              render={({ field: { ref, ...field } }) => (
                <CheckboxField className=''>
                  <Checkbox {...field} checked={field.value} />
                  <Label>是否為全新品</Label>
                </CheckboxField>
              )}
            />
          </div>

          <Controller
            control={control}
            name='name'
            render={({ field, fieldState }) => (
              <Field className='sm:col-span-3'>
                <Label>物品名稱</Label>
                <Input type='text' autoComplete='off' {...field} />
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name='reservePrice'
            render={({ field, fieldState }) => (
              <Field className='sm:col-span-3'>
                <Label>
                  期望金額
                  <InfoPopover>
                    <InfoPopoverPanel>
                      物品上架競拍期望最低售出之價格；若競拍價格低於期望金額，公司將自動拍下此物品並安排下一次競拍
                    </InfoPopoverPanel>
                  </InfoPopover>
                </Label>
                <InputGroup>
                  <div className='grid place-content-center' data-slot='icon'>
                    {currencySign('JPY')}
                  </div>
                  <Input
                    type='number'
                    autoComplete='off'
                    {...field}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === '' ? '' : parseFloat(e.target.value),
                      )
                    }}
                  />
                </InputGroup>
                {!!field.value && !fieldState.invalid && (
                  <Description className='text-end'>
                    約 {currencySign('TWD')}
                    {Math.floor(field.value * jpyBuyingRate).toLocaleString()}
                  </Description>
                )}
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
              </Field>
            )}
          />

          <div className='col-span-full'>
            <UploadImage control={control} item={item} />
          </div>

          <Controller
            control={control}
            name='description'
            render={({ field, fieldState }) => (
              <Field className='col-span-full'>
                <Label className='mb-3'>物品描述</Label>
                <div data-slot='control'>
                  <QuillTextEditorClientOnly
                    defaultValue={item?.description}
                    onTextChange={(delta, oldDelta) =>
                      field.onChange(JSON.stringify(oldDelta.compose(delta).ops))
                    }
                  />
                </div>
              </Field>
            )}
          />
        </div>

        <div className='mt-6 flex items-center gap-x-4'>
          <div className='mx-auto'></div>

          {process.env.NODE_ENV === 'development' && (
            <Button outline onClick={() => router.refresh()}>
              Refetch
            </Button>
          )}

          {process.env.NODE_ENV === 'development' && (
            <Button
              outline
              onClick={() => {
                console.log('values', getValues())
                console.log('dirtyFields', dirtyFields)
                console.log('defaultValues', defaultValues)
              }}
            >
              Log values
            </Button>
          )}

          {/* {isDirty && (
            <Button outline onClick={() => reset()}>
              重設
            </Button>
          )} */}

          <Button type='submit' color='indigo' loading={isSubmitting}>
            送出
          </Button>
        </div>
      </form>
    </div>
  )
}

function UploadImage({
  item,
  control,
}: {
  item?: Item
  control: Control<z.output<typeof Schema>>
}) {
  const LIMIT = 10
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'photos',
  })
  const { field, formState } = useController({
    control,
    name: 'photos',
  })
  const [isPending, startTransition] = useTransition()
  const { createUrl, revokeUrl } = useObjectUrl()

  return (
    <div className='relative'>
      {isPending && (
        <div className='absolute inset-0 z-30 animate-pulse rounded bg-black opacity-40' />
      )}
      <input
        type='file'
        id='file-upload'
        hidden
        accept='image/jpeg'
        multiple
        onChange={
          !item
            ? (e) => {
                const files =
                  e.target.files &&
                  Array.from(e.target.files).filter(
                    (file) => file.type === 'image/jpeg',
                  )
                if (!files?.length) return
                for (const file of Array.from(files).slice(
                  0,
                  LIMIT - fields.length,
                )) {
                  append({ file })
                }
              }
            : (e) => {
                const files =
                  e.target.files &&
                  Array.from(e.target.files).filter(
                    (file) => file.type === 'image/jpeg',
                  )
                if (!files?.length) return
                if (item) {
                  const formData = new FormData()
                  for (
                    let i = 0;
                    i < files.length && i < LIMIT - item.photos.length;
                    i++
                  ) {
                    formData.append('photo', files[i])
                    formData.append('sorted', `${i + item.photos.length + 1}`)
                  }
                  startTransition(async () => {
                    await ConsignorUpsertItemPhoto(item.id, formData)
                    for (let i = 0; i < files.length; i++) {
                      append({ file: files[i] })
                    }
                  })
                }
              }
        }
      />

      <Field>
        <Label className='inline-flex items-center gap-x-2'>
          物品圖片 {fields.length}/{LIMIT}{' '}
          {item && <span className='text-gray-500'>(自動儲存)</span>}
          {((item && item.photos.length < LIMIT) || fields.length < LIMIT) && (
            <button onClick={() => document.getElementById('file-upload')?.click()}>
              <span className='sr-only'>新增圖片</span>
              <PlusIcon className='h-5 w-5 rounded bg-indigo-500 p-0.5 text-white hover:bg-indigo-400' />
            </button>
          )}
        </Label>

        <div data-slot='control'>
          {fields.length === 0 ? (
            <div className='flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
              <div className='text-center'>
                <PhotoIcon
                  className='mx-auto h-12 w-12 text-gray-300'
                  aria-hidden='true'
                />
                <p className='mt-2 text-xs leading-5 text-gray-600'>支援 JPG</p>
              </div>
            </div>
          ) : (
            <DraggableList
              onSwap={
                !item
                  ? move
                  : (from, to) => {
                      move(from, to)
                      startTransition(async () => {
                        await ConsignorReorderItemPhoto(item.id, {
                          originalSorted: from + 1,
                          newSorted: to + 1,
                        })
                      })
                    }
              }
            >
              {fields.map((f, i) => (
                <DraggableListItem key={f.id} className='relative'>
                  <article className='aspect-h-7 aspect-w-10 relative block w-60 overflow-hidden rounded-lg bg-gray-100'>
                    <img
                      src={'file' in f ? createUrl(f.file) : f.photo}
                      className='pointer-events-none object-contain'
                      alt=''
                    />
                  </article>
                  {formState.errors['photos']?.[i] && (
                    <p className='text-end text-sm text-red-600'>
                      {formState.errors['photos']?.[i]?.message}
                    </p>
                  )}

                  <div className='absolute right-0 top-0 z-20 flex w-fit items-center gap-x-2 pr-3 pt-1'>
                    <DraggableHandler>
                      <span className='sr-only'>Drag to move</span>
                      <ArrowsOutLineHorizontal className='size-7 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
                    </DraggableHandler>
                    <button
                      type='button'
                      onClick={
                        !item
                          ? () => {
                              const f = field.value[i]
                              if ('file' in f) {
                                remove(i)
                                revokeUrl(f.file)
                              }
                            }
                          : () => {
                              const f = field.value[i]
                              if ('file' in f) {
                                revokeUrl(f.file)
                              }
                              startTransition(async () => {
                                await ConsignorDeleteItemPhoto(item.id, i + 1)
                                remove(i)
                              })
                            }
                      }
                    >
                      <span className='sr-only'>Delete</span>
                      <XMarkIcon className='size-7 rounded-full bg-white/80 stroke-2 p-1 text-gray-400 hover:bg-white hover:text-gray-600' />
                    </button>
                  </div>
                </DraggableListItem>
              ))}
            </DraggableList>
          )}
        </div>
        {formState.errors.photos?.message && (
          <ErrorMessage>{formState.errors.photos?.message}</ErrorMessage>
        )}
      </Field>
    </div>
  )
}

function useObjectUrl() {
  const [urlMap] = useState(() => new Map<File, string>())

  const createUrl = useCallback(
    (file: File) => {
      const url = urlMap.get(file) ?? URL.createObjectURL(file)
      if (!urlMap.has(file)) {
        urlMap.set(file, url)
      }
      return url
    },
    [urlMap],
  )

  const revokeUrl = useCallback(
    (file: File) => {
      const url = urlMap.get(file)
      if (url) {
        URL.revokeObjectURL(url)
        urlMap.delete(file)
      }
    },
    [urlMap],
  )

  return { createUrl, revokeUrl }
}
