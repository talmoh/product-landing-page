'use client'
import Image from 'next/image'

export default function Hero() {
  return (
    <section id="presentation" className="presentation">
      <div style={{ width: '100%', height: 420, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
        <video
          src="/images/OZSTREETWEAR.mp4"
          width={1600}
          height={600}
          style={{ borderRadius: 8, width: '100%', height: '100%', objectFit: 'cover' }}
          autoPlay
          muted
          loop
          playsInline
          aria-label="Vidéo de présentation OZSTREETWEAR"
          // controls // décommentez si vous voulez afficher les contrôles
        />
      </div>
    </section>
  )
}