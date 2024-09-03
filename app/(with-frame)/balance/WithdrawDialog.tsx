'use client'

import { ConsignorWalletWithdrawal } from '@/app/api/frontend/wallets/ConsignorWalletWithdrawal'
import { Button } from '@/app/catalyst-ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@/app/catalyst-ui/dialog'
import { ErrorMessage, Field, FieldGroup, Label } from '@/app/catalyst-ui/fieldset'
import { Input } from '@/app/catalyst-ui/input'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const WITHDRAW_FEE = 5

export default function WithdrawDialogButton({ balance }: { balance: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type='button' outline onClick={() => setIsOpen(true)}>
        我要提領
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <WithdrawForm
          balance={balance}
          onSuccess={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </Dialog>
    </>
  )
}

function WithdrawForm({
  balance,
  onSuccess,
  onCancel,
}: {
  balance: number
  onSuccess: () => void
  onCancel: () => void
}) {
  const { control, watch, handleSubmit } = useForm<{ amount: number }>({
    defaultValues: {
      amount: '' as any,
    },
  })

  const amount = watch('amount')

  return (
    <form
      onSubmit={handleSubmit(async () => {
        const res = await ConsignorWalletWithdrawal({ amount })
        if (res.error === '1703') {
          toast.error('餘額不足')
          return
        }
        if (res.error) {
          toast.error(`操作錯誤: ${res.error}`)
          return
        }
        toast.success('提領申請已送出')
        onSuccess()
      })}
    >
      <DialogTitle>提領申請</DialogTitle>
      <DialogBody>
        <FieldGroup>
          <Field>
            <Label>手續費</Label>
            <div data-slot='control'>{WITHDRAW_FEE.toLocaleString()}</div>
          </Field>

          <Field>
            <Label>餘額</Label>
            <div data-slot='control'>
              {balance.toLocaleString()}
              {!!amount && balance >= amount && (
                <span className='italic text-zinc-400'>
                  {` - ${WITHDRAW_FEE.toLocaleString()} - ${amount.toLocaleString()} = ${(balance - WITHDRAW_FEE - amount).toLocaleString()}`}
                </span>
              )}
            </div>
          </Field>

          <Controller
            control={control}
            name='amount'
            rules={{
              required: '請輸入提領金額',
              min: { value: 0, message: '請輸入正確金額' },
              max: { value: balance - WITHDRAW_FEE, message: '餘額不足' },
            }}
            render={({ field, fieldState }) => (
              <Field>
                <Label>提領金額</Label>
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
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </DialogBody>
      <DialogActions>
        <Button type='button' plain onClick={onCancel}>
          取消
        </Button>
        <Button type='submit'>送出申請</Button>
      </DialogActions>
    </form>
  )
}
