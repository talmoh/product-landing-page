import Image from 'next/image'

export default function Hero(){
  return (
    <section id="presentation" className="presentation">
      <div className="container">
        {/* Déplace ton image vers public/images/presentation_oz.png */}
        <Image src="/images/presentation_oz.png" alt="présentation oz" width={1600} height={600} />
      </div>
    </section>
  )
}