'use client'

import { Configs } from '@/app/api/frontend/GetConfigs'
import { ExchangeRate } from '@/app/api/frontend/GetJPYRates'
import { ConsignorWalletWithdrawal } from '@/app/api/frontend/wallets/ConsignorWalletWithdrawal'
import { Button } from '@/app/catalyst-ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@/app/catalyst-ui/dialog'
import {
  Description,
  ErrorMessage,
  Field,
  FieldGroup,
  Label,
} from '@/app/catalyst-ui/fieldset'
import { Input, InputGroup } from '@/app/catalyst-ui/input'
import { currencySign } from '@/app/static'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function WithdrawDialogButton({
  balance,
  jpyExchangeRate,
  withdrawalTransferFee,
}: {
  balance: number
  jpyExchangeRate: ExchangeRate
} & Pick<Configs, 'withdrawalTransferFee'>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type='button' outline onClick={() => setIsOpen(true)}>
        我要提領
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <WithdrawForm
          balance={balance}
          jpyExchangeRate={jpyExchangeRate}
          withdrawalTransferFee={withdrawalTransferFee}
          onSuccess={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </Dialog>
    </>
  )
}

function WithdrawForm({
  balance,
  jpyExchangeRate,
  withdrawalTransferFee,
  onSuccess,
  onCancel,
}: {
  balance: number
  jpyExchangeRate: ExchangeRate
  onSuccess: () => void
  onCancel: () => void
} & Pick<Configs, 'withdrawalTransferFee'>) {
  const { control, watch, handleSubmit } = useForm<{ amount: number }>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      amount: '' as any,
    },
  })

  const amount = watch('amount')
  const feeInJpy = Math.ceil(withdrawalTransferFee / jpyExchangeRate.buying)
  const amountInTwd = Math.floor(amount * jpyExchangeRate.buying)

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
            <p className='text-zinc-950'>
              {currencySign('TWD')}
              {withdrawalTransferFee.toLocaleString()}
              {/* <span className='italic text-zinc-400'>
                (約 {currencySign('JPY')}
                {feeInJpy.toLocaleString()})
              </span> */}
            </p>
          </Field>

          <Field>
            <Label>餘額</Label>
            <p className='text-zinc-950'>
              {currencySign('JPY')}
              {balance.toLocaleString()}
              {!!amount && balance >= amount && (
                <span className='italic text-zinc-400'>
                  <> - {amount.toLocaleString()}</>
                  <> = {(balance - amount).toLocaleString()}</>
                </span>
              )}
            </p>
          </Field>

          <Controller
            control={control}
            name='amount'
            rules={{
              required: '請輸入提領金額',
              validate: (value) => {
                const atLeast = feeInJpy + Math.ceil(1 / jpyExchangeRate.buying)
                if (value <= atLeast) {
                  return '最少需大於 ' + atLeast
                }
                if (value > balance - feeInJpy) {
                  return '餘額不足'
                }
                if (value > 100_000) {
                  return '最大提領金額為 100,000'
                }
              },
            }}
            render={({ field, fieldState }) => (
              <Field>
                <Label>提領金額</Label>
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
                {fieldState.error && (
                  <ErrorMessage>{fieldState.error.message}</ErrorMessage>
                )}
                {field.value && !fieldState.invalid && (
                  <Description className='text-end'>
                    約 {currencySign('TWD')}
                    {/* {amountInTwd.toLocaleString()} -{' '} */}
                    {/* {withdrawalTransferFee.toLocaleString()} ={' '} */}
                    {(amountInTwd - withdrawalTransferFee).toLocaleString()}
                  </Description>
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
