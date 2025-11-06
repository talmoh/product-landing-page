import Image from "next/image";
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductsGrid from '../components/ProductsGrid'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section className="container mt-5">
          <h1 className="text-center mb-4">Nos modèles</h1>
          <ProductsGrid />
        </section>

        <section className="container my-5">
          <h2 className="text-center mb-4">Nos Produits Phares</h2>
          <div id="mySwiper" style={{ padding: '1rem', textAlign: 'center' }}>
            Carrousel à intégrer (Swiper)
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
