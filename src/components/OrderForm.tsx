'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useCart } from '../context/CartContext'

type Wilaya = { id: string; label: string; cost: number }
type Commune = { id: string; label: string }

const WILAYAS: Wilaya[] = [
  { id: '1', label: '1 - Adrar', cost: 1050 }, { id: '2', label: '2 - Chlef', cost: 600 },
  { id: '3', label: '3 - Laghouat', cost: 600 }, { id: '4', label: '4 - Oum El Bouaghi', cost: 600 },
  { id: '5', label: '5 - Batna', cost: 600 }, { id: '6', label: '6 - Béjaïa', cost: 600 },
  { id: '7', label: '7 - Biskra', cost: 750 }, { id: '8', label: '8 - Béchar', cost: 750 },
  { id: '9', label: '9 - Blida', cost: 450 }, { id: '10', label: '10 - Bouira', cost: 600 },
  { id: '11', label: '11 - Tamanrasset', cost: 1250 }, { id: '12', label: '12 - Tébessa', cost: 750 },
  { id: '13', label: '13 - Tlemcen', cost: 600 }, { id: '14', label: '14 - Tiaret', cost: 600 },
  { id: '15', label: '15 - Tizi Ouzou', cost: 600 }, { id: '16', label: '16 - Alger', cost: 400 },
  { id: '17', label: '17 - Djelfa', cost: 750 }, { id: '18', label: '18 - Jijel', cost: 600 },
  { id: '19', label: '19 - Sétif', cost: 600 }, { id: '20', label: '20 - Saïda', cost: 600 },
  { id: '21', label: '21 - Skikda', cost: 600 }, { id: '22', label: '22 - Sidi Bel Abbès', cost: 600 },
  { id: '23', label: '23 - Annaba', cost: 600 }, { id: '24', label: '24 - Guelma', cost: 600 },
  { id: '25', label: '25 - Constantine', cost: 600 }, { id: '26', label: '26 - Médéa', cost: 600 },
  { id: '27', label: '27 - Mostaganem', cost: 600 }, { id: '28', label: '28 - M/Sila', cost: 600 },
  { id: '29', label: '29 - Mascara', cost: 600 }, { id: '30', label: '30 - Ouargla', cost: 750 },
  { id: '31', label: '31 - Oran', cost: 600 }, { id: '32', label: '32 - El Bayadh', cost: 1050 },
  { id: '33', label: '33 - Illizi', cost: 1250 }, { id: '34', label: '34 - Bordj Bou Arreridj', cost: 600 },
  { id: '35', label: '35 - Boumerdès', cost: 450 }, { id: '36', label: '36 - El Tarf', cost: 600 },
  { id: '37', label: '37 - Tindouf', cost: 1250 }, { id: '38', label: '38 - Tissemsilt', cost: 600 },
  { id: '39', label: '39 - El Oued', cost: 750 }, { id: '40', label: '40 - Khenchela', cost: 600 },
  { id: '41', label: '41 - Souk Ahras', cost: 600 }, { id: '42', label: '42 - Tipaza', cost: 600 },
  { id: '43', label: '43 - Mila', cost: 600 }, { id: '44', label: '44 - Aïn Defla', cost: 600 },
  { id: '45', label: '45 - Naâma', cost: 1050 }, { id: '46', label: '46 - Aïn Témouchent', cost: 600 },
  { id: '47', label: '47 - Ghardaïa', cost: 750 }, { id: '48', label: '48 - Relizane', cost: 600 }
]

export default function OrderForm({ defaultProduct = 'Produit 1' }: { defaultProduct?: string }) {
  const { cart, clearCart } = useCart()
  const searchParams = useSearchParams()

  // Lire les paramètres URL
  const urlProduct = searchParams?.get('product')
  const urlPrice = searchParams?.get('price') 
  const urlId = searchParams?.get('id')

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  /*const [city, setCity] = useState('')*/
  const [postalCode, setPostalCode] = useState('')
  const [wilayaId, setWilayaId] = useState('')
  const [commune, setCommune] = useState('')
  const [communes, setCommunes] = useState<Commune[]>([])
  const [notes, setNotes] = useState('')
  const [deliveryCost, setDeliveryCost] = useState<number>(0)
  const [codAmount, setCodAmount] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Déterminer les items à commander : panier OU produit URL
  const items = useMemo(() => {
    if (cart.length > 0) {
      // Priorité au panier s'il contient des items
      return cart.map(i => ({ name: i.name, quantity: i.qty, price: i.price }))
    } else if (urlProduct && urlPrice) {
      // Sinon utiliser le produit venant de l'URL
      return [{ name: urlProduct, quantity: 1, price: Number(urlPrice) }]
    } else {
      // Fallback sur le produit par défaut
      return [{ name: defaultProduct, quantity: 1, price: 0 }]
    }
  }, [cart, defaultProduct, urlProduct, urlPrice])

  const subtotal = items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0)
  const total = subtotal + deliveryCost + Number(codAmount || 0)

  // Calculer coût livraison et communes quand wilaya change
  useEffect(() => {
    if (!wilayaId) {
      setCommunes([])
      setCommune('')
      setDeliveryCost(0)
      return
    }

    let mounted = true
    ;(async () => {
      try {
        const [dRes, cRes] = await Promise.all([
          fetch('/api/calculate-delivery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wilayaId }) }),
          fetch('/api/communes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wilayaId }) })
        ])

        if (!mounted) return

        if (dRes.ok) {
          const d = await dRes.json()
          setDeliveryCost(Number(d.cost) || 0)
        } else {
          setDeliveryCost(0)
        }

        if (cRes.ok) {
          const c = await cRes.json()
          console.log('Réponse communes pour wilayaId', wilayaId, ':', c)
          setCommunes(Array.isArray(c?.communes) ? c.communes : [])
        } else {
          console.error('Erreur communes:', await cRes.text())
          setCommunes([])
        }
      } catch {
        if (mounted) {
          setCommunes([])
          setDeliveryCost(0)
        }
      }
    })()

    return () => { mounted = false }
  }, [wilayaId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName, phone, email, address, /*city,*/ postalCode,
          wilayaId, commune,
          items,
          quantity: items.reduce((s, it) => s + Number(it.quantity || 0), 0),
          deliveryCost,
          codAmount: codAmount === '' ? 0 : Number(codAmount),
          notes
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Erreur serveur')
      setResult({ success: true, data })
      clearCart()
    } catch (err: any) {
      setResult({ success: false, message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <input className="input" required placeholder="Nom complet" value={fullName} onChange={e => setFullName(e.target.value)} />
        <input className="input" required placeholder="Téléphone" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>

      {/* Affichage des produits commandés */}
      {(cart.length > 0 || (urlProduct && urlPrice)) && (
        <div className="card">
          <h4>Articles dans la commande</h4>
          {items.map((item, idx) => (
            <div key={`${item.name}-${idx}`} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>{item.name}</div>
                <div className="helper">{item.quantity} × {(item.price || 0).toLocaleString()} DZD</div>
              </div>
              <div style={{ fontWeight: 800 }}>{(Number(item.price || 0) * item.quantity).toLocaleString()} DZD</div>
            </div>
          ))}
          <div style={{ textAlign: 'right', marginTop: 8, fontWeight: 800 }}>
            Sous-total: {subtotal.toLocaleString()} DZD
          </div>
        </div>
      )}

      <div className="card" style={{ display: 'grid', gap: 10 }}>
        <div>
          <label className="field-label">Wilaya</label>
          <select className="input" value={wilayaId} onChange={e => setWilayaId(e.target.value)} required>
            <option value="">Sélectionner la wilaya</option>
            {WILAYAS.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
          </select>
        </div>

        <div>
          <label className="field-label">Commune</label>
          <select className="input" value={commune} onChange={e => setCommune(e.target.value)} required>
            <option value="">{communes.length ? 'Sélectionner la commune' : 'Choisir la wilaya'}</option>
            {communes.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <label className="field-label">Adresse complète</label>
          <input className="input" required placeholder="Rue, numéro, immeuble..." value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="field-label">Ville</label>
           { /* <input className="input" value={city} onChange={e => setCity(e.target.value)} /> */}
          </div>
          <div style={{ width: 160 }}>
            <label className="field-label">Code postal</label>
            <input className="input" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="field-label">Montant COD (DA) (optionnel)</label>
            <input className="input" value={codAmount} onChange={e => setCodAmount(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div style={{ width: 180 }}>
            <label className="field-label">Remarques</label>
            <input className="input" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="order-summary card" style={{ marginTop: 8 }}>
        <div className="order-row"><div>Produit(s)</div><div>{items.length} article(s)</div></div>
        <div className="order-row"><div>Sous-total</div><div>{subtotal.toLocaleString()} DZD</div></div>
        <div className="order-row"><div>Livraison</div><div>{deliveryCost.toLocaleString()} DZD</div></div>
        <div className="order-row"><div>Montant COD</div><div>{Number(codAmount || 0).toLocaleString()} DZD</div></div>
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: 8, paddingTop: 8 }} className="order-row">
          <div style={{ fontWeight: 900 }}>TOTAL</div>
          <div style={{ fontWeight: 900 }}>{total.toLocaleString()} DZD</div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Envoi...' : 'Passer la commande'}</button>
          <button type="button" className="btn secondary" onClick={() => { clearCart(); window.location.href = '/' }}>Annuler</button>
        </div>
      </div>

      {result && (
        <div style={{ marginTop: 8, color: result.success ? 'green' : 'crimson' }}>
          {result.success ? <>Commande créée. Réf : <strong>{result.data?.shipmentId ?? '—'}</strong></> : <>{result.message}</>}
        </div>
      )}
    </form>
  )
}