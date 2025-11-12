'use client'
import React, { useEffect, useMemo, useState } from 'react'

type Wilaya = { id: string; label: string; cost: number }

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

export default function OrderForm({ defaultProduct }: { defaultProduct?: string }) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  /*const [city, setCity] = useState('')*/
  const [postalCode, setPostalCode] = useState('')
  const [wilayaId, setWilayaId] = useState<string>('')
  const [commune, setCommune] = useState<string>('')
  const [product, setProduct] = useState(defaultProduct ?? 'Produit 1')
  const [quantity, setQuantity] = useState(1)
  const [weight, setWeight] = useState<number | ''>('')
  const [codAmount, setCodAmount] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [deliveryCost, setDeliveryCost] = useState<number>(0)
  const [result, setResult] = useState<any>(null)

  // prix produit courant
  const productPrice = useMemo(() => PRODUCT_PRICES[product] ?? 0, [product])

  // calcul totals
  const subtotal = productPrice * quantity
  const total = subtotal + deliveryCost + (Number(codAmount || 0))

  // quand on change la wilaya, appeler l'API de calcul
  useEffect(() => {
    if (!wilayaId) {
      setDeliveryCost(0)
      return
    }

    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/calculate-delivery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wilayaId })
        })
        const data = await res.json()
        if (res.ok && mounted) setDeliveryCost(Number(data.cost) || 0)
      } catch {
        if (mounted) setDeliveryCost(0)
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
          fullName,
          phone,
          email,
          address,
          /*city,*/
          postalCode,
          wilayaId,
          commune,
          product,
          productPrice,
          quantity,
          weight: weight === '' ? undefined : Number(weight),
          codAmount: codAmount === '' ? 0 : Number(codAmount),
          deliveryCost,
          notes
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
    <form onSubmit={handleSubmit} style={{ maxWidth: 920, margin: '0 auto', display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <input required placeholder="Nom complet" value={fullName} onChange={e => setFullName(e.target.value)} />
        <input required placeholder="Téléphone" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <input type="email" placeholder="Email (optionnel)" value={email} onChange={e => setEmail(e.target.value)} />
        {/*<input placeholder="Ville" value={city} onChange={e => setCity(e.target.value)} /> */}
        <div style={{ minWidth: 220 }}>
          <select value={wilayaId} onChange={e => setWilayaId(e.target.value)} required>
            <option value="">Wilaya</option>
            {WILAYAS.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <select value={commune} onChange={e => setCommune(e.target.value)}>
          <option value="">Commune (optionnel)</option>
          {/* remplir dynamiquement si tu as la liste */}
        </select>
        <input required placeholder="Adresse complète (rue, bâtiment)" value={address} onChange={e => setAddress(e.target.value)} />
        <input placeholder="Code postal" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label style={{ minWidth: 90 }}>Produit</label>
        <select value={product} onChange={e => setProduct(e.target.value)}>
          <option>Produit 1</option>
          <option>Produit 2</option>
          <option>Produit 3</option>
        </select>

        <label style={{ minWidth: 70, marginLeft: 12 }}>Quantité</label>
        <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: 80 }} />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <input placeholder="Poids (kg) (optionnel)" value={weight} onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))} />
        <input placeholder="Montant COD (DA) (optionnel)" value={codAmount} onChange={e => setCodAmount(e.target.value === '' ? '' : Number(e.target.value))} />
      </div>

      <textarea placeholder="Remarques (ex : étage, précisions livraison)" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />

      {/* Order Summary */}
      <div className="card" style={{ padding: 16, marginTop: 8 }}>
        <h4>Résumé de commande</h4>
        <table style={{ width: '100%', marginTop: 8 }}>
          <tbody>
            <tr>
              <th style={{ textAlign: 'left' }}>Produit</th>
              <td style={{ textAlign: 'right' }}>{product} × {quantity}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Sous-total</th>
              <td style={{ textAlign: 'right' }}>{subtotal.toLocaleString()} DZD</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Livraison</th>
              <td style={{ textAlign: 'right' }}>{deliveryCost.toLocaleString()} DZD</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left' }}>Montant COD</th>
              <td style={{ textAlign: 'right' }}>{Number(codAmount || 0).toLocaleString()} DZD</td>
            </tr>
            <tr style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <th style={{ textAlign: 'left', paddingTop: 8 }}>TOTAL</th>
              <td style={{ textAlign: 'right', fontWeight: 800, paddingTop: 8 }}>{total.toLocaleString()} DZD</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Envoi...' : 'Acheter'}</button>
          <button type="button" className="btn-outline" onClick={() => {
            setFullName(''); setPhone(''); setEmail(''); setAddress(''); /*setCity('');*/ setPostalCode('');
            setWilayaId(''); setCommune(''); setProduct('Produit 1'); setQuantity(1); setWeight(''); setCodAmount(''); setNotes(''); setDeliveryCost(0)
          }}>Annuler</button>
        </div>
      </div>

      {result && (
        <div style={{ marginTop: 8, color: result.success ? 'green' : 'crimson' }}>
          {result.success ? (
            <>
              Commande créée. Référence livraison : <strong>{result.data?.shipmentId ?? '—'}</strong>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, marginTop: 6 }}>{JSON.stringify(result.data?.providerResponse ?? result.data, null, 2)}</pre>
            </>
          ) : (
            <>{result.message}</>
          )}
        </div>
      )}
    </form>
  )
}