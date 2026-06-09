if (!process.env.API_BASE_URL) {
  throw new Error('API_BASE_URL is not set')
}

export const POST = async (request: Request) => {
  const newUrl = new URL(
    `${process.env.API_BASE_URL}${new URL(request.url).pathname}`,
  )
  const newRequest = new Request(newUrl, request)
  return fetch(newRequest)
}
