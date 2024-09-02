'use client'

import { Configs } from '@/app/api/frontend/GetConfigs'
import { ConsignorSubmitPayment } from '@/app/api/frontend/reports/ConsignorSubmitPayment'
import { Record } from '@/app/api/frontend/reports/GetRecords'
import { Button } from '@/app/catalyst-ui/button'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@/app/catalyst-ui/description-list'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@/app/catalyst-ui/dialog'
import { ErrorMessage, Field } from '@/app/catalyst-ui/fieldset'
import { Input } from '@/app/catalyst-ui/input'
import { currencySign } from '@/app/static'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export function SubmitPayment({
  recordId,
  yahooAuctionFee,
  bankName,
  bankCode,
  bankAccount,
}: Omit<SubmitPaymentDialogProps, 'isOpen' | 'onClose'>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type='button' color='indigo' onClick={() => setIsOpen(true)}>
        提交付款
      </Button>
      <SubmitPaymentDialog
        recordId={recordId}
        yahooAuctionFee={yahooAuctionFee}
        bankName={bankName}
        bankCode={bankCode}
        bankAccount={bankAccount}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

type SubmitPaymentDialogProps = {
  recordId: string
} & Pick<Record, 'yahooAuctionFee'> &
  Pick<Configs, 'bankName' | 'bankCode' | 'bankAccount'> &
  ({ isOpen: boolean; onClose: () => void } | { isOpen?: never; onClose?: never })

export function SubmitPaymentDialog({
  recordId,
  yahooAuctionFee,
  bankName,
  bankCode,
  bankAccount,
  isOpen = true,
  onClose,
}: SubmitPaymentDialogProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      opCode: '',
    },
  })
  onClose ??= () => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('submit-payment')
    router.replace(`?${newSearchParams}`)
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>支付日拍手續費</DialogTitle>
      <form
        id='withdrawal-form'
        onSubmit={handleSubmit(async (data) => {
          const res = await ConsignorSubmitPayment(recordId, {
            opCode: data.opCode,
          })
          if (res.error) {
            toast.error(`操作錯誤: ${res.error}`)
            return
          }
          toast.success('已提交付款')
          onClose()
        })}
      >
        <DialogBody>
          <DescriptionList>
            <DescriptionTerm>手續費</DescriptionTerm>
            <DescriptionDetails>
              {currencySign('TWD')}
              {yahooAuctionFee?.toLocaleString()}
            </DescriptionDetails>

            <DescriptionTerm>銀行名稱</DescriptionTerm>
            <DescriptionDetails>{bankName}</DescriptionDetails>

            <DescriptionTerm>銀行代碼</DescriptionTerm>
            <DescriptionDetails>{bankCode}</DescriptionDetails>

            <DescriptionTerm>銀行帳號</DescriptionTerm>
            <DescriptionDetails>{bankAccount}</DescriptionDetails>

            <DescriptionTerm>
              <label htmlFor='withdrawal-account'>匯出帳號</label>
            </DescriptionTerm>
            <DescriptionDetails>
              <Controller
                control={control}
                name='opCode'
                rules={{
                  required: '必填',
                  pattern: { value: /^[0-9]{5}$/, message: '格式錯誤' },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Field>
                    <Input
                      type='text'
                      {...field}
                      id='withdrawal-account'
                      placeholder='請輸入您的匯出帳號後五碼'
                    />
                    <ErrorMessage>{error?.message}</ErrorMessage>
                  </Field>
                )}
              />
            </DescriptionDetails>
          </DescriptionList>
        </DialogBody>
        <DialogActions>
          <Button
            type='button'
            disabled={isSubmitting}
            plain
            onClick={onClose}
          >
            取消
          </Button>
          <Button
            type='submit'
            form='withdrawal-form'
            color='indigo'
            disabled={isSubmitting}
          >
            已完成匯款
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
