'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '../../context/CartContext'

export default function CartPage() {
  const router = useRouter()
  const { cart, updateItemQty, removeFromCart, clearCart } = useCart()

  const subtotal = cart.reduce((s, it) => s + (Number(it.price || 0) * it.qty), 0)

  if (!cart.length) {
    return (
      <main className="container" style={{ padding: '2rem 1rem' }}>
        <h1>Votre panier</h1>
        <p>Votre panier est vide.</p>
        <Link href="/" className="btn">Continuer les achats</Link>
      </main>
    )
  }

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <h1>Votre panier</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18, marginTop: 18 }}>
        <section>
          {cart.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 120, height: 90, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                {item.img ? (
                  <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#f4f4f4' }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{item.name}</div>
                    <div className="helper">{(item.price || 0).toLocaleString()} DZD</div>
                  </div>
                  <button className="btn secondary" onClick={() => removeFromCart(item.id)}>Supprimer</button>
                </div>

                <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="btn secondary" onClick={() => updateItemQty(item.id, item.qty - 1)}>-</button>
                  <div style={{ minWidth: 46, textAlign: 'center', fontWeight: 700 }}>{item.qty}</div>
                  <button className="btn" onClick={() => updateItemQty(item.id, item.qty + 1)}>+</button>
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <button className="btn secondary" onClick={() => { clearCart() }}>Vider le panier</button>
            <Link href="/" className="btn">Continuer les achats</Link>
          </div>
        </section>

        <aside className="card">
          <h3>Récapitulatif</h3>
          <div className="order-row" style={{ marginTop: 10 }}>
            <div>Sous-total</div>
            <div>{subtotal.toLocaleString()} DZD</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              className="btn"
              onClick={() => {
                // const ok = confirm('Voulez-vous finaliser votre commande ?')
                /*if (ok)*/ router.push('/order')
              }}
            >
              Finaliser la commande
            </button>
            <div style={{ marginTop: 8 }} className="helper">Vous pourrez modifier l’adresse et les détails avant l’envoi.</div>
          </div>
        </aside>
      </div>
    </main>
  )
}