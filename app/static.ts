import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { z } from 'zod'

export const SITE_NAME = '日拍'

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

export const DATE_FORMAT = 'yyyy-MM-dd'
export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'

export const ROWS_PER_PAGE = 'rowsPerPage'
export const PAGE = 'page'
export const PaginationSchema = z.object({
  [ROWS_PER_PAGE]: z.coerce.number().min(1).default(10).catch(10),
  [PAGE]: z.coerce.number().min(0).default(0).catch(0),
})
export type PaginationSearchParams = z.output<typeof PaginationSchema>
export const defaultPagination = PaginationSchema.parse({})

export const toPercent = (num: number) => {
  return num.toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })
}

/**
 * Calculates the factorial of a number.
 * @param num - The number to calculate the factorial for.
 * @returns The factorial of the given number.
 */
function factorial(num: number): number {
  if (num === 0 || num === 1) {
    return 1
  }
  return num * factorial(num - 1)
}

/**
 * Calculates the number of combinations (n choose p).
 * @param n - The total number of items.
 * @param p - The number of items to pick.
 * @returns The number of combinations.
 */
export function combinations(n: number, p: number): number {
  if (p > n) {
    throw new Error('p cannot be greater than n')
  }
  return factorial(n) / (factorial(p) * factorial(n - p))
}
