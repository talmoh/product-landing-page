'use client'
import Image from 'next/image'

export default function Hero() {
  return (
    <section id="presentation" className="presentation">
      <div className="video-container">
        <video
          src="/images/OZSTREETWEAR.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Vidéo de présentation OZSTREETWEAR"
          className="hero-video"
        />
      </div>
    </section>
  )
}