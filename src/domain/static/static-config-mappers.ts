import { STATIC_CONFIGS_DATA } from './static-configs.data'

function createMapFromTuple<
  T extends Readonly<Array<Record<PropertyKey, any>>>,
  By extends keyof T[number],
>(tuple: T, by: By): Record<By, T[number]> {
  return tuple.reduce<any>((acc, cur) => {
    const key = cur[by]
    ;(acc as Record<By, T>)[key] = cur
    return acc
  }, {})
}

type ConfigObj =
  | {
      key: string
      value: number
      message: string
    }
  | {
      key: string
      value: string
      message: string
    }

function createMapper<T extends readonly ConfigObj[]>(data: T) {
  const indexByKey = createMapFromTuple(data, 'key')
  const indexByValue = createMapFromTuple(data, 'value')

  function get<K extends 'key' | 'value'>(key: K, value: T[number][K]): T[number] {
    if (key === 'key') {
      return indexByKey[value] as any
    }
    return indexByValue[value] as any
  }

  function getEnum<K extends T[number]['key'] | T[number]['value']>(
    index: K,
  ): K extends T[number]['key'] ? T[number]['value'] : T[number]['key'] {
    if (index in indexByKey) {
      return indexByKey[index].value as any
    }
    return indexByValue[index].key
  }

  return { data, get, enum: getEnum }
}

export const WALLET_ACTION = createMapper(STATIC_CONFIGS_DATA.walletAction)
export type WALLET_ACTION = (typeof WALLET_ACTION.data)[number]

export const BONUS_ACTION = createMapper(STATIC_CONFIGS_DATA.bonusAction)
export type BONUS_ACTION = (typeof BONUS_ACTION.data)[number]

export const ITEM_TYPE = createMapper(STATIC_CONFIGS_DATA.itemType)
export type ITEM_TYPE = (typeof ITEM_TYPE.data)[number]

export const ITEM_STATUS = createMapper(STATIC_CONFIGS_DATA.itemStatus)
export type ITEM_STATUS = (typeof ITEM_STATUS.data)[number]

export const AUCTION_ITEM_STATUS = createMapper(STATIC_CONFIGS_DATA.auctionItemStatus)
export type AUCTION_ITEM_STATUS = (typeof AUCTION_ITEM_STATUS.data)[number]

export const CONSIGNOR_STATUS = createMapper(STATIC_CONFIGS_DATA.consignorStatus)
export type CONSIGNOR_STATUS = (typeof CONSIGNOR_STATUS.data)[number]

export const CONSIGNOR_VERIFICATION_STATUS = createMapper(
  STATIC_CONFIGS_DATA.consignorVerificationStatus,
)
export type CONSIGNOR_VERIFICATION_STATUS =
  (typeof CONSIGNOR_VERIFICATION_STATUS.data)[number]

export const ACTION_TYPE = createMapper(STATIC_CONFIGS_DATA.actionType)
export type ACTION_TYPE = (typeof ACTION_TYPE.data)[number]

export const SHIPMENT_TYPE = createMapper(STATIC_CONFIGS_DATA.shipmentType)
export type SHIPMENT_TYPE = (typeof SHIPMENT_TYPE.data)[number]

export const SHIPPING_STATUS = createMapper(STATIC_CONFIGS_DATA.shippingStatus)
export type SHIPPING_STATUS = (typeof SHIPPING_STATUS.data)[number]

export const RECORD_TYPE = createMapper(STATIC_CONFIGS_DATA.recordType)
export type RECORD_TYPE = (typeof RECORD_TYPE.data)[number]

export const RECORD_STATUS = createMapper(STATIC_CONFIGS_DATA.recordStatus)
export type RECORD_STATUS = (typeof RECORD_STATUS.data)[number]
