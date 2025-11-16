'use client'
import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useCart } from '../context/CartContext'

const IMAGES = [
  '/images/product1.jpg',
  '/images/product2.jpg',
  '/images/product3.jpg'
]

const PRODUCT_PRICES = [3999, 4999, 2999]

export default function ProductCarousel() {
  const { addToCart } = useCart()

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        style={{ paddingBottom: 20 }}
      >
        {IMAGES.map((src, i) => (
          <SwiperSlide key={i}>
            <div style={{ width: '100%', height: 420, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
              <Image src={src} alt={`Produit ${i + 1}`} fill style={{ objectFit: 'cover' }} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
        <a className="btn" href="/order">Commander</a>

        <button
          type="button"
          className="btn"
          onClick={() =>
            addToCart({
              id: `product-${1}`, // par défaut on ajoute le 1er produit visible, tu peux adapter
              name: `Produit 1`,
              price: PRODUCT_PRICES[0],
              qty: 1,
              img: IMAGES[0]
            })
          }
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}