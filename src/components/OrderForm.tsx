'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

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
  { id: '27', label: '27 - Mostaganem', cost: 600 }, { id: '28', label: '28 - M\'Sila', cost: 600 },
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

// Exemple prix produits (à adapter)
const PRODUCT_PRICES: Record<string, number> = {
  'Produit 1': 3999,
  'Produit 2': 4999,
  'Produit 3': 2999
}

export default function OrderForm({ defaultProduct = 'Produit 1' }: { defaultProduct?: string }) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  /*const [city, setCity] = useState('')*/
  const [postalCode, setPostalCode] = useState('')
  const [wilayaId, setWilayaId] = useState('')
  const [commune, setCommune] = useState('')
  const [communes, setCommunes] = useState<Commune[]>([])
  const [product, setProduct] = useState(defaultProduct)
  const [quantity, setQuantity] = useState(1)
  const [weight, setWeight] = useState<number | ''>('')
  const [codAmount, setCodAmount] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [deliveryCost, setDeliveryCost] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const productPrice = useMemo(() => PRODUCT_PRICES[product] ?? 0, [product])
  const subtotal = productPrice * quantity
  const total = subtotal + deliveryCost + Number(codAmount || 0)

  // fetch communes when wilaya changes
  useEffect(() => {
    setCommunes([])
    setCommune('')
    if (!wilayaId) {
      setDeliveryCost(0)
      return
    }

    // fetch delivery cost and communes concurrently
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
        } else setDeliveryCost(0)

        if (cRes.ok) {
          const c = await cRes.json()
          setCommunes(Array.isArray(c?.communes) ? c.communes : [])
        } else setCommunes([])
      } catch {
        if (mounted) {
          setDeliveryCost(0)
          setCommunes([])
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
          wilayaId, commune, product, productPrice, quantity,
          weight: weight === '' ? undefined : Number(weight),
          codAmount: codAmount === '' ? 0 : Number(codAmount),
          deliveryCost, notes
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Erreur serveur')
      setResult({ success: true, data })
    } catch (err: any) {
      setResult({ success: false, message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="kicker">Commande</div>
      <div className="grid-2">
        <div>
          <div className="product-thumb">
            <Image src={`/images/product1.jpg`} alt={product} width={800} height={600} style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ marginTop: 12 }}>
            <h3 style={{ marginBottom: 6 }}>{product}</h3>
            <div className="helper">Prix unitaire : <strong>{productPrice.toLocaleString()} DZD</strong></div>
          </div>
        </div>

        <div>
          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <label className="field-label">Nom complet</label>
              <input className="input" required value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>

            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">Téléphone</label>
                <input className="input" required value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="form-grid">
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
            </div>

            <div>
              <label className="field-label">Adresse complète</label>
              <input className="input" required value={address} onChange={e => setAddress(e.target.value)} />
            </div>

            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">Ville</label>
                {/*<input className="input" value={city} onChange={e => setCity(e.target.value)} />*/}
              </div>
              <div style={{ width: 160 }}>
                <label className="field-label">Code postal</label>
                <input className="input" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">Quantité</label>
                <input className="input" type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Poids (kg) (optionnel)</label>
                <input className="input" value={weight} onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>

            <div>
              <label className="field-label">Montant COD (DA) (optionnel)</label>
              <input className="input" value={codAmount} onChange={e => setCodAmount(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>

            <div>
              <label className="field-label">Remarques</label>
              <textarea className="input" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* order summary */}
      <div className="order-summary" style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><strong>Résumé de la commande</strong></div>
          <div className="helper">Prix en DZD</div>
        </div>

        <div className="order-row"><div>Produit</div><div>{product} × {quantity}</div></div>
        <div className="order-row"><div>Sous-total</div><div>{subtotal.toLocaleString()} DZD</div></div>
        <div className="order-row"><div>Livraison</div><div>{deliveryCost.toLocaleString()} DZD</div></div>
        <div className="order-row"><div>Montant COD</div><div>{Number(codAmount || 0).toLocaleString()} DZD</div></div>
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: 8, paddingTop: 8 }} className="order-row">
          <div style={{ fontWeight: 900 }}>TOTAL</div>
          <div style={{ fontWeight: 900 }}>{total.toLocaleString()} DZD</div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Envoi...' : 'Passer la commande'}</button>
          <button type="button" className="btn secondary" onClick={() => {
            // reset
            setFullName(''); setPhone(''); setEmail(''); setAddress(''); /*setCity('');*/ setPostalCode('');
            setWilayaId(''); setCommune(''); setProduct(defaultProduct); setQuantity(1); setWeight(''); setCodAmount(''); setNotes(''); setDeliveryCost(0)
          }}>Annuler</button>
        </div>

        {result && (
          <div style={{ marginTop: 10, color: result.success ? 'green' : 'crimson' }}>
            {result.success ? (
              <>
                Commande créée. Référence livraison : <strong>{result.data?.shipmentId ?? '—'}</strong>
              </>
            ) : (
              <>{result.message}</>
            )}
          </div>
        )}
      </div>
    </form>
  )
}