import Image from "next/image";
import Hero from '../components/Hero'
import ProductCarousel from '../components/ProductCarousel'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <section id="product" className="container mt-5">
          <h1 className="text-center mb-4">Présentation du produit</h1>
          <ProductCarousel />
        </section>

        <section className="container my-5">
          <h2 className="text-center mb-4">Description</h2>
          <div className="card" style={{ padding: 20 }}>
            <p>
              Exemple de description courte du produit — caractéristiques, matériaux,
              disponibilité et appel à l'action.
            </p>
            <a className="btn" href="#product" style={{ marginTop: 12 }}>Acheter maintenant</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
