import fs from 'fs/promises'

export async function POST(request: Request) {
  const body = await request.formData()
  const file = body.get('image') as File
  await fs.writeFile(
    `./public/uploads/${file.name}`,
    Buffer.from(await file.arrayBuffer()),
  )

  return new Response(`http://172.234.95.57:3001/uploads/${file.name}`)
}
