import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // champs obligatoires généraux
    const required = ['fullName', 'phone', 'address', 'wilayaId', 'commune']
    for (const k of required) {
      if (body[k] === undefined || body[k] === '') {
        return NextResponse.json({ message: `${k} manquant` }, { status: 400 })
      }
    }

    // deliveryCost peut être 0 mais doit être défini
    if (body.deliveryCost === undefined) {
      return NextResponse.json({ message: `deliveryCost manquant` }, { status: 400 })
    }

    // construire la liste d'items : soit body.items (préféré), soit fallback product+quantity
    let items: { name: string; quantity: number; price?: number }[] = []
    if (Array.isArray(body.items) && body.items.length > 0) {
      items = body.items.map((it: any) => ({
        name: String(it.name || it.title || 'Produit'),
        quantity: Number(it.quantity || it.qty || 1),
        price: it.price !== undefined ? Number(it.price) : undefined
      }))
    } else if (body.product && body.quantity) {
      items = [{
        name: String(body.product),
        quantity: Number(body.quantity) || 1,
        price: body.productPrice !== undefined ? Number(body.productPrice) : undefined
      }]
    } else {
      return NextResponse.json({ message: 'Produit manquant (items ou product+quantity requis)' }, { status: 400 })
    }

    const payload = {
      sender: { name: process.env.MY_SHOP_NAME ?? 'OZSTREETWEAR' },
      recipient: {
        name: body.fullName,
        phone: body.phone,
        email: body.email || undefined,
        address: body.address,
        /*city: body.city,*/
        postal_code: body.postalCode || undefined,
        wilaya_id: body.wilayaId,
        commune: body.commune
      },
      items,
      delivery_cost: Number(body.deliveryCost) || 0,
      weight: body.weight || undefined,
      cod_amount: body.codAmount || 0,
      notes: body.notes || ''
    }

    const YALIDINE_API_URL = process.env.YALIDINE_API_URL
    const YALIDINE_API_KEY = process.env.YALIDINE_API_KEY
    const AUTH_HEADER = process.env.YALIDINE_AUTH_HEADER || 'Authorization'

    if (!YALIDINE_API_URL || !YALIDINE_API_KEY) {
      return NextResponse.json({ message: 'Yalidine non configuré' }, { status: 500 })
    }

    const res = await fetch(YALIDINE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [AUTH_HEADER]: `Bearer ${YALIDINE_API_KEY}` },
      body: JSON.stringify(payload)
    })

    const data = await res.json().catch(() => null)
    if (!res.ok) {
      return NextResponse.json({ message: 'Erreur Yalidine', details: data }, { status: 502 })
    }

    return NextResponse.json({ shipmentId: data?.id ?? data?.reference ?? null, providerResponse: data })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message ?? 'Erreur serveur' }, { status: 500 })
  }
}