import { lazySingleton } from '@/helper/singleton'
import dotenv from 'dotenv'

if (!process.env.CONSUL_URL) {
  throw new Error('CONSUL_URL is not set')
}

export const getMysqlKv = lazySingleton(async () => {
  const url = `${process.env.CONSUL_URL}/v1/kv/storage/mysql/master/auction-master`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Cannot get consol mysql data')
  }

  const [x] = (await res.json()) as Array<{
    LockIndex: number
    Key: string
    Flags: number
    Value: string
    CreateIndex: number
    ModifyIndex: number
  }>

  const kv = dotenv.parse(Buffer.from(x.Value, 'base64')) as {
    host: string
    account: string
    password: string
    dbname: string
    // tls: string;
    // max_open_conns: string;
    // max_idle_conns: string;
    // max_conn_lifetime: string;
  }

  return kv
})

export const getSystemKv = lazySingleton(async () => {
  const url = `${process.env.CONSUL_URL}/v1/kv/system`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Cannot get consol system data')
  }

  const [x] = (await res.json()) as Array<{
    LockIndex: number
    Key: string
    Flags: number
    Value: string
    CreateIndex: number
    ModifyIndex: number
  }>

  const kv = dotenv.parse(Buffer.from(x.Value, 'base64')) as {
    site: string
  }

  return kv
})
