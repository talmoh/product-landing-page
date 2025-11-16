import OrderForm from '../../components/OrderForm'

export const metadata = { title: 'Commander — OZSTREETWEAR' }

export default function OrderPage() {
  return (
    <>
      <main id="main" role="main" className="page-order" style={{ padding: '2rem 1rem' }}>
        <div className="container">
          <h1 className="text-center mb-4">Formulaire de commande</h1>
          <OrderForm defaultProduct="Produit 1" />
        </div>
      </main>
    </>
  )
}