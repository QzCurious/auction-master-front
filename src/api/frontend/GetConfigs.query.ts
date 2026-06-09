import { QueryOptions } from '@tanstack/react-query'
import { GetConfigs } from './GetConfigs'

export const GetConfigsQueryOptions = {
  queryKey: ['configs'],
  queryFn: () => GetConfigs(),
} satisfies QueryOptions
