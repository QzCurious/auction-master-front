'use client'

import { session } from '@/app/api/session'
import { XCircleIcon } from '@heroicons/react/20/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ErrorMessage, Field, Label } from '../catalyst-ui/fieldset'
import { Input } from '../catalyst-ui/input'
import { Button } from '../catalyst-ui/button'

const Schema = z.object({
  account: z.string().min(1, { message: '必填' }),
  password: z.string().min(1, { message: '必填' }),
})

export function SignInForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<z.input<typeof Schema>>({
    defaultValues: {
      account: '',
      password: '',
    },
    resolver: zodResolver(Schema),
  })
  const router = useRouter()

  return (
    <>
      {errors.root && (
        <div className='mb-4 rounded-md bg-red-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-red-800'>
                {errors.root.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        className='space-y-6'
        onSubmit={handleSubmit(async (data) => {
          const res = await session(data)
          if (res.error === '1002') {
            setError('root', { message: '被封鎖的帳號，請聯繫客服' })
            return
          }
          if (res.error === '1004' || res.error === '1602') {
            setError('root', { message: '帳號或密碼錯誤' })
            return
          }
          const goto = new URLSearchParams(location.search).get('goto')
          router.replace(goto || '/')
        })}
      >
        <Controller
          control={control}
          name='account'
          render={({ field, fieldState }) => (
            <Field>
              <Label>帳號</Label>
              <Input type='text' {...field} />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        <Controller
          control={control}
          name='password'
          render={({ field, fieldState }) => (
            <Field>
              <Label>密碼</Label>
              <Input type='password' autoComplete='current-password' {...field} />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </Field>
          )}
        />

        {/* <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='remember-me'
            name='remember-me'
            type='checkbox'
            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
          />
          <label
            htmlFor='remember-me'
            className='ml-3 block text-sm leading-6 text-gray-700'
          >
            Remember me
          </label>
        </div>
      </div> */}

        <Button
          type='submit'
          color='indigo'
          loading={isSubmitting}
          className='w-full'
        >
          登入
        </Button>
      </form>
    </>
  )
}
