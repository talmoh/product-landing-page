import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function detectKeys(sample: any) {
  const keys = Object.keys(sample || {})
  const wilayaKeys = ['wilaya_id','wilaya','wilaya_code','province_id','province','state_id','state','governorate','governorate_id','id_wilaya','code']
  const communeNameKeys = ['name','city','commune','city_name','commune_name','name_en','name_fr','label']
  const foundWilaya = wilayaKeys.find(k => keys.includes(k))
  const foundCommune = communeNameKeys.find(k => keys.includes(k))
  return { wilayaKey: foundWilaya || null, communeNameKey: foundCommune || null }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const wilayaId = String(body?.wilayaId ?? '').trim()
    if (!wilayaId) return NextResponse.json({ message: 'wilayaId requis' }, { status: 400 })

    const filePath = path.join(process.cwd(), 'src', 'data', 'algeria_cities.json')
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: 'Fichier de communes introuvable. Exécute scripts/fetch-communes.js' }, { status: 500 })
    }

    const raw = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(raw)

    if (!Array.isArray(data)) {
      return NextResponse.json({ message: 'Format JSON inattendu (attendu tableau)' }, { status: 500 })
    }

    // detect keys from first item
    const { wilayaKey, communeNameKey } = detectKeys(data[0] || {})

    // build mapping grouped by wilaya identifier (string)
    const groups: Record<string, { id: string; label: string }[]> = {}
    data.forEach((item: any, idx: number) => {
      // try several possibilities for wilaya id / code / name
      const wVal = (wilayaKey && item[wilayaKey]) ?? item['state_id'] ?? item['province_id'] ?? item['governorate'] ?? item['wilaya_code'] ?? item['code'] ?? null
      const label = (communeNameKey && item[communeNameKey]) ?? item['name'] ?? item['city'] ?? item['commune'] ?? item['label'] ?? `commune-${idx}`
      const id = item['id'] ?? item['city_id'] ?? item['commune_id'] ?? String(idx)

      const key = wVal !== null && wVal !== undefined ? String(wVal) : 'unknown'
      if (!groups[key]) groups[key] = []
      groups[key].push({ id: String(id), label: String(label) })
    })

    // try direct match by wilayaId (number/code)
    if (groups[wilayaId] && groups[wilayaId].length) {
      return NextResponse.json({ wilayaId, communes: groups[wilayaId] })
    }

    // try case-insensitive name match: check keys whose string includes wilayaId
    const lower = wilayaId.toLowerCase()
    for (const k of Object.keys(groups)) {
      if (k.toLowerCase().includes(lower) || k === lower) {
        return NextResponse.json({ wilayaId: k, communes: groups[k] })
      }
    }

    // fallback: try to match by scanning items for wilaya name inside known properties
    const fallback: { id: string; label: string }[] = []
    data.forEach((item: any, idx: number) => {
      const candidateWilayaName = item['wilaya'] ?? item['governorate'] ?? item['province'] ?? item['state']
      if (candidateWilayaName && String(candidateWilayaName).toLowerCase().includes(lower)) {
        const label = (communeNameKey && item[communeNameKey]) ?? item['name'] ?? item['city'] ?? `commune-${idx}`
        const id = item['id'] ?? item['city_id'] ?? String(idx)
        fallback.push({ id: String(id), label: String(label) })
      }
    })
    if (fallback.length) return NextResponse.json({ wilayaId, communes: fallback })

    // nothing found
    return NextResponse.json({ wilayaId, communes: [] })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message ?? 'Erreur serveur' }, { status: 500 })
  }
}