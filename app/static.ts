import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { z } from 'zod'

export const itemStatusTextMap = {
  2: '已提交估價',
} as Record<number, string>

export const cookieConfigs = {
  token: {
    name: 'consignor-token',
    opts: {
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      httpOnly: true,
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === 'production',
    },
  },
  refreshToken: {
    name: 'consignor-refresh-token',
    opts: {
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      httpOnly: true,
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === 'production',
    },
  },
} satisfies Record<string, { name: string; opts: Partial<ResponseCookie> }>

export const ROWS_PER_PAGE = 'rowsPerPage'
export const PAGE = 'page'
export const PaginationSchema = z.object({
  [ROWS_PER_PAGE]: z.coerce.number().min(1).default(10).catch(10),
  [PAGE]: z.coerce.number().min(0).default(0).catch(0),
})
export type PaginationSearchParams = z.output<typeof PaginationSchema>
export const defaultPagination = PaginationSchema.parse({})
