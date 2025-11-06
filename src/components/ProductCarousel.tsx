'use client'
import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const IMAGES = [
  '/images/product1.jpg',
  '/images/product2.jpg',
  '/images/product3.jpg'
]

export default function ProductCarousel() {
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
        <a className="btn" href="#contact">Commander</a>
        <a className="btn" href="#">Ajouter au panier</a>
      </div>
    </div>
  )
}