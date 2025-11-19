'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useCart } from '../context/CartContext'
import { track } from '@vercel/analytics'

const IMAGES = [
  '/images/product1.jpg',
  '/images/product2.jpg',
  '/images/product3.jpg'
]

const PRODUCT_PRICES = [3999, 4999, 2999]
const PRODUCT_NAMES = ['Produit 1', 'Produit 2', 'Produit 3']

export default function ProductCarousel() {
  const { addToCart } = useCart()
  const [activeIndex, setActiveIndex] = useState(0)

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex)
    // Track slide change
    track('product_view', { 
      product: PRODUCT_NAMES[swiper.activeIndex],
      price: PRODUCT_PRICES[swiper.activeIndex],
      position: swiper.activeIndex + 1
    })
  }

  const getCurrentProduct = () => ({
    id: `product-${activeIndex + 1}`,
    name: PRODUCT_NAMES[activeIndex],
    price: PRODUCT_PRICES[activeIndex],
    img: IMAGES[activeIndex]
  })

  const handleAddToCart = () => {
    const product = getCurrentProduct()
    // Track add to cart event
    track('add_to_cart', { 
      product: product.name, 
      price: product.price,
      product_id: product.id 
    })
    addToCart({ ...product, qty: 1 })
  }

  const handleOrderClick = () => {
    const product = getCurrentProduct()
    // Track order button click
    track('start_checkout', { 
      product: product.name, 
      price: product.price,
      product_id: product.id 
    })
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: true }}
        onSlideChange={handleSlideChange}
        onInit={(swiper) => setActiveIndex(swiper.activeIndex)}
        style={{ paddingBottom: 20 }}
      >
        {IMAGES.map((src, i) => (
          <SwiperSlide key={i}>
            <div style={{ width: '100%', height: 420, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
              <Image src={src} alt={PRODUCT_NAMES[i]} fill style={{ objectFit: 'cover' }} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Affichage du produit actif en dehors du swiper */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <h3>{PRODUCT_NAMES[activeIndex]}</h3>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#FFD400' }}>
          {PRODUCT_PRICES[activeIndex].toLocaleString()} DZD
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
        <Link 
          href={`/order?product=${encodeURIComponent(PRODUCT_NAMES[activeIndex])}&price=${PRODUCT_PRICES[activeIndex]}&id=product-${activeIndex + 1}`}
          className="btn"
          onClick={handleOrderClick}
        >
          Commander
        </Link>

        <button
          type="button"
          className="btn"
          onClick={handleAddToCart}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}