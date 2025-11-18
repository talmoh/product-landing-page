import { Suspense } from 'react'
import OrderForm from '../../components/OrderForm'

export const metadata = { title: 'Commander — OZSTREETWEAR' }

export default function OrderPage() {
  return (
    <main id="main" role="main" className="page-order" style={{ padding: '2rem 1rem' }}>
      <div className="container">
        <h1 className="text-center mb-4">Formulaire de commande</h1>
        <Suspense fallback={<div>Chargement du formulaire...</div>}>
          <OrderForm defaultProduct="Produit 1" />
        </Suspense>
      </div>
    </main>
  )
}