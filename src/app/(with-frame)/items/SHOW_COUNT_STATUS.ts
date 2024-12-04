import { ITEM_STATUS } from '@/domain/static/static-config-mappers'
import { StatusFlow } from '@/domain/static/StatusFlow'

const side = 'consignor'

export const SHOW_COUNT_STATUS = Object.values(StatusFlow.flow)
  .filter((v) => 'adjudicator' in v && v.adjudicator === side)
  .map((v) => ITEM_STATUS.enum(v.status))
