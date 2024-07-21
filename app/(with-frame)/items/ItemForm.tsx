'use client'

import { ITEM_TYPE_MAP } from '@/app/api/frontend/GetFrontendConfigs.data'
import { ConsignorDeleteItemPhoto } from '@/app/api/frontend/items/ConsignorDeleteItemPhoto'
import { ConsignorUpsertItemPhoto } from '@/app/api/frontend/items/ConsignorUpsertItemPhoto'
import { CreateItem } from '@/app/api/frontend/items/CreateItem'
import { Item } from '@/app/api/frontend/items/GetConsignorItems'
import { UpdateConsignorItem } from '@/app/api/frontend/items/UpdateConsignorItem'
import { Button } from '@/app/catalyst-ui/button'
import { Checkbox, CheckboxField } from '@/app/catalyst-ui/checkbox'
import { Description, ErrorMessage, Field, Label } from '@/app/catalyst-ui/fieldset'
import { Input, InputGroup } from '@/app/catalyst-ui/input'
import ErrorAlert from '@/app/components/alerts/ErrorAlert'
import InfoPopover, { InfoPopoverPanel } from '@/app/components/InfoPopover'
import { PlusIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState, useTransition } from 'react'
import {
  Control,
  Controller,
  useController,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import SortablePhotoList from './SortablePhotoList'

const QuillTextEditor = dynamic(
  () => import('@/app/components/QuillTextEditor/QuillTextEditor'),
  { ssr: false },
)

const Schema = z.object({
  name: z.string().min(1, { message: '必填' }),
  type: z.number(),
  reservePrice: z.number({ message: '必填' }),
  photos: z
    .array(
      z.union([
        z.object({ sorted: z.number(), photo: z.string() }),
        z
          .object({
            file: z.instanceof(File, { message: '必填' }),
          })
          .refine(({ file }) => file.size <= 20 * 1024 * 1024, {
            message: '上限 20MB',
          }),
      ]),
    )
    .min(1, { message: '必填' })
    .max(30, { message: '上限 30 張' }),
  description: z.string().default(''),
})

interface ItemFormProps {
  item?: Item
  yenToNtdRate: number
}

export default function ItemForm({ item, yenToNtdRate }: ItemFormProps) {
  const defaultValues = useMemo(
    () =>
      ({
        name: item?.name || '',
        type: item?.type || 0,
        reservePrice: item?.reservePrice || ('' as any),
        photos: item?.photos || [],
        description: item?.description || '',
      }) as z.output<typeof Schema>,
    [item?.description, item?.name, item?.photos, item?.reservePrice, item?.type],
  )
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm<z.output<typeof Schema>>({
    defaultValues,
    resolver: zodResolver(Schema),
  })
  const router = useRouter()

  return (
    <div>
      {errors.root?.message && <ErrorAlert message={errors.root.message} />}
      <form
        className='col-span-7 mt-10'
        onSubmit={handleSubmit(
          !item
            ? async (data) => {
                const formData = new FormData()
                formData.append('name', data.name)
                formData.append('type', data.type.toString())
                formData.append('reservePrice', data.reservePrice.toString())
                formData.append('description', data.description.toString())
                for (let i = 0; i < data.photos.length; i++) {
                  const f = data.photos[i]
                  if ('file' in f) {
                    formData.append('photo', f.file)
                    formData.append('sorted', `${i + 1}`)
                  }
                }

                const res = await CreateItem(formData)
                if (res.error) {
                  setError('root', { message: `操作失敗: ${res.error}` })
                  return
                }
                toast.success('新增成功')
                router.push('/items')
              }
            : async (data) => {
                const res = await UpdateConsignorItem(item.id, data)
                if (res.error) {
                  setError('root', { message: `操作失敗: ${res.error}` })
                  return
                }
                toast.success('更新成功')
              },
        )}
      >
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <Controller
            control={control}
            name='type'
            render={({ field: { ref, ...field } }) => (
              <CheckboxField className='col-span-full'>
                <Checkbox
                  {...field}
                  checked={field.value === ITEM_TYPE_MAP.FixedPriceItemType}
                  onChange={(v) =>
                    field.onChange(v ? ITEM_TYPE_MAP.FixedPriceItemType : 0)
                  }
                />
                <Label>是否為定價物品</Label>
              </CheckboxField>
            )}
          />

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
                      經由鑑價師評估此物品可能被拍出的最高價格
                    </InfoPopoverPanel>
                  </InfoPopover>
                </Label>
                <InputGroup>
                  <div className='grid place-content-center' data-slot='icon'>
                    ¥
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
                {field.value && !fieldState.invalid && (
                  <Description className='text-end'>
                    約 {Number(field.value * yenToNtdRate).toLocaleString()} 台幣
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
                  <QuillTextEditor
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
            <Button outline onClick={() => console.log(getValues())}>
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
        <div className='pointer-events-none absolute inset-0 z-10 animate-pulse rounded bg-black opacity-40' />
      )}
      <input
        type='file'
        id='file-upload'
        hidden
        multiple
        onChange={
          !item
            ? (e) => {
                const files = e.target.files
                if (!files) return
                for (const file of Array.from(files)) {
                  append({ file })
                }
              }
            : (e) => {
                const files = e.target.files
                if (!files) return
                if (item) {
                  const formData = new FormData()
                  for (let i = 0; i < files.length; i++) {
                    formData.append('photo', files[i])
                    formData.append('sorted', `${i + item.photos.length + 1}`)
                  }
                  startTransition(async () => {
                    await ConsignorUpsertItemPhoto(item.id, formData)
                    for (const file of Array.from(files)) {
                      append({ file })
                    }
                  })
                }
              }
        }
      />

      <Field>
        <Label className='inline-flex items-center gap-x-2'>
          物品圖片 {item && <span className='text-gray-500'>(自動儲存)</span>}
          <button onClick={() => document.getElementById('file-upload')?.click()}>
            <span className='sr-only'>新增圖片</span>
            <PlusIcon className='h-5 w-5 rounded bg-indigo-500 p-0.5 text-white hover:bg-indigo-400' />
          </button>
        </Label>

        <div className='relative overflow-hidden' data-slot='control'>
          <SortablePhotoList
            photos={field.value.map((f, i) => ({
              photo: 'file' in f ? createUrl(f.file) : f.photo,
              sorted: i + 1,
            }))}
            onMove={move}
            onDelete={
              !item
                ? (i) => {
                    const f = field.value[i]
                    if ('file' in f) {
                      remove(i)
                      revokeUrl(f.file)
                    }
                  }
                : (i) => {
                    const f = field.value[i]
                    if ('sorted' in f) {
                      startTransition(async () => {
                        await ConsignorDeleteItemPhoto(item.id, f.sorted)
                        remove(i)
                      })
                    }
                  }
            }
          />
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
