import type { NextApiRequest, NextApiResponse } from 'next'

export type ProductResponse = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(process.env.PRODUCT_API! + '/products')
    const products = (await response.json()) as ProductResponse[]
    res.status(200).json({ products })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch products' })
  }
}
