'use client'
import Image from 'next/image'

export default function Hero() {
  return (
    <section id="presentation" className="presentation">
      <div style={{ width: '100%', height: 420, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
        <Image
          src="/images/presentation_oz.png"
          alt="présentation oz"
          width={1600}
          height={600}
          priority
          style={{ borderRadius: 8 }}
        />
      </div>
    </section>
  )
}