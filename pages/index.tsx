import { useState, useEffect } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { ProductResponse } from './api/products'
import Image from 'next/image'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function getServerSideProps() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + '/products')
  const data = await res.json()
  const products = data.products as ProductResponse[]
  return { props: { products } }
}

export default function Home({ products }: { products: ProductResponse[] }) {
  const [data, setData] = useState<ProductResponse[]>([])
  const [search, setSearch] = useState('')

  async function getProducts() {
    if (!search) {
      setData(products)
      return
    }
    const Fuse = (await import('fuse.js')).default
    const fuse = new Fuse(products, {
      keys: ['title', 'category', 'description', 'price'],
    })
    const searchedItems = fuse.search(search)
    const filteredProducts = searchedItems.map((result) => result.item)
    setData(filteredProducts)
  }

  useEffect(() => {
    getProducts()
  }, [search, products])

  return (
    <div className={`${geistSans.className} ${geistMono.className} font-sans`}>
      <div className='flex items-center mb-3.5'>
        <input
          id='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search products...'
          className='w-full md:w-80 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4'>
        {data.map((product) => (
          <div
            key={product.id}
            className='border-2 border-gray-400 p-2.5 rounded-lg shadow-2xl'
          >
            <div
              style={{ width: '100%', height: '250px', position: 'relative' }}
            >
              <Image
                src={product.image}
                alt={product.title}
                fill={true}
                priority
              />
            </div>

            <h3 className='text-xl'>{product.title}</h3>
            <p>{product.category}</p>
            <div className='flex justify-between mt-2.5'>
              <p>${product.price}</p>
              {/* <p>{product.rating.rate}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
