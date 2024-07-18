'use client'

import { UpdateConsignorPassword } from '@/app/api/frontend/consignor/UpdateConsignorPassword'
import { Button } from '@/app/catalyst-ui/button'
import { ErrorMessage, Field, Label } from '@/app/catalyst-ui/fieldset'
import { Input } from '@/app/catalyst-ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const Schema = z
  .object({
    oldPassword: z.string().min(1, { message: '請輸入舊密碼' }),
    password: z.string().min(1, { message: '請輸入新密碼' }),
    confirmPassword: z.string().min(1, { message: '請再次輸入新密碼' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '請重新確認新密碼',
    path: ['confirmPassword'],
  })

export default function ChangePasswordForm() {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm<z.infer<typeof Schema>>({
    defaultValues: {
      password: '',
      oldPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(Schema),
  })

  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'>
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>變更密碼</h2>
        {/* <p className='mt-1 text-sm leading-6 text-gray-400'>
          Update your password associated with your account.
        </p> */}
      </div>

      <form
        className='md:col-span-2'
        onSubmit={handleSubmit(async (data) => {
          const res = await UpdateConsignorPassword({
            oldPassword: data.oldPassword,
            password: data.password,
          })

          if (res.error === '11') {
            setError('password', { message: '新密碼不能與舊密碼相同' })
            return
          }
          if (res.error === '1003') {
            toast.error('請重新登入')
            router.push('/auth/sign-in')
            return
          }
          if (res.error === '1004') {
            setError('oldPassword', { message: '舊密碼錯誤' })
            return
          }

          toast.success('變更密碼成功')
          reset()
        })}
      >
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
          <Controller
            name='oldPassword'
            control={control}
            render={({ field, fieldState }) => (
              <Field className='col-span-full'>
                <Label>當前密碼</Label>
                <Input type='password' autoComplete='oldPassword' {...field} />
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
              </Field>
            )}
          />

          <Controller
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <Field className='col-span-full'>
                <Label>新密碼</Label>
                <Input type='password' autoComplete='new-password' {...field} />
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
              </Field>
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            render={({ field, fieldState }) => (
              <Field className='col-span-full'>
                <Label>確認密碼</Label>
                <Input type='password' autoComplete='new-password' {...field} />
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
              </Field>
            )}
          />
        </div>

        <div className='mt-8 flex'>
          <Button type='submit' color='indigo' loading={isSubmitting}>
            送出
          </Button>
        </div>
      </form>
    </div>
  )
}
