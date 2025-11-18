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

    console.log('Premier élément du JSON:', JSON.stringify(data[0], null, 2))
    console.log('Clés détectées:', { wilayaKey, communeNameKey })
    console.log('Recherche pour wilayaId:', wilayaId)

    // build mapping grouped by wilaya identifier (string)
    const groups: Record<string, { id: string; label: string }[]> = {}
    data.forEach((item: any, idx: number) => {
      // Essayer plusieurs possibilités pour l'ID wilaya
      let wVal = null
      
      // Test direct avec la clé détectée
      if (wilayaKey && item[wilayaKey] !== null && item[wilayaKey] !== undefined) {
        wVal = String(item[wilayaKey])
      }
      
      // Fallback sur des clés communes
      if (wVal === null) {
        wVal = item['wilaya_id'] ?? item['state_id'] ?? item['province_id'] ?? 
               item['wilaya_code'] ?? item['code'] ?? item['wilaya'] ?? 
               item['governorate'] ?? null
      }

      const label = (communeNameKey && item[communeNameKey]) ?? 
                   item['name'] ?? item['city'] ?? item['commune'] ?? 
                   item['label'] ?? item['commune_name'] ?? `commune-${idx}`
      const id = item['id'] ?? item['city_id'] ?? item['commune_id'] ?? String(idx)

      const key = wVal !== null && wVal !== undefined ? String(wVal) : 'unknown'
      
      // Nettoyer la clé (enlever zéros leading si nécessaire)
      const cleanKey = key.replace(/^0+/, '') || key
      
      if (!groups[cleanKey]) groups[cleanKey] = []
      groups[cleanKey].push({ id: String(id), label: String(label) })
    })

    console.log('Groupes trouvés:', Object.keys(groups).slice(0, 10)) // Log premiers groupes
    console.log(`Groupe pour wilayaId ${wilayaId}:`, groups[wilayaId]?.length || 0, 'communes')

    // Essayer match direct
    if (groups[wilayaId] && groups[wilayaId].length) {
      return NextResponse.json({ wilayaId, communes: groups[wilayaId] })
    }

    // Essayer sans zéros leading
    const cleanWilayaId = wilayaId.replace(/^0+/, '') || wilayaId
    if (groups[cleanWilayaId] && groups[cleanWilayaId].length) {
      return NextResponse.json({ wilayaId: cleanWilayaId, communes: groups[cleanWilayaId] })
    }

    // Essayer avec zéro leading
    const paddedWilayaId = wilayaId.padStart(2, '0')
    if (groups[paddedWilayaId] && groups[paddedWilayaId].length) {
      return NextResponse.json({ wilayaId: paddedWilayaId, communes: groups[paddedWilayaId] })
    }

    // Match par nom de wilaya (cas insensible)
    const WILAYA_NAMES = {
      '1': 'adrar', '2': 'chlef', '3': 'laghouat', '4': 'oum el bouaghi',
      '5': 'batna', '6': 'béjaïa', '7': 'biskra', '8': 'béchar',
      '9': 'blida', '10': 'bouira', '11': 'tamanrasset', '12': 'tébessa',
      '13': 'tlemcen', '14': 'tiaret', '15': 'tizi ouzou', '16': 'alger',
      '17': 'djelfa', '18': 'jijel', '19': 'sétif', '20': 'saïda',
      '21': 'skikda', '22': 'sidi bel abbès', '23': 'annaba', '24': 'guelma',
      '25': 'constantine', '26': 'médéa', '27': 'mostaganem', '28': 'm\'sila',
      '29': 'mascara', '30': 'ouargla', '31': 'oran', '32': 'el bayadh',
      '33': 'illizi', '34': 'bordj bou arreridj', '35': 'boumerdès', '36': 'el tarf',
      '37': 'tindouf', '38': 'tissemsilt', '39': 'el oued', '40': 'khenchela',
      '41': 'souk ahras', '42': 'tipaza', '43': 'mila', '44': 'aïn defla',
      '45': 'naâma', '46': 'aïn témouchent', '47': 'ghardaïa', '48': 'relizane'
    }

    const targetName = WILAYA_NAMES[wilayaId as keyof typeof WILAYA_NAMES]
    if (targetName) {
      const fallback: { id: string; label: string }[] = []
      data.forEach((item: any, idx: number) => {
        const candidateWilayaName = String(item['wilaya'] ?? item['governorate'] ?? item['province'] ?? item['state'] ?? '').toLowerCase()
        if (candidateWilayaName.includes(targetName.toLowerCase()) || targetName.toLowerCase().includes(candidateWilayaName)) {
          const label = (communeNameKey && item[communeNameKey]) ?? item['name'] ?? item['city'] ?? `commune-${idx}`
          const id = item['id'] ?? item['city_id'] ?? String(idx)
          fallback.push({ id: String(id), label: String(label) })
        }
      })
      if (fallback.length) {
        console.log(`Match par nom "${targetName}":`, fallback.length, 'communes')
        return NextResponse.json({ wilayaId, communes: fallback })
      }
    }

    // Aucun résultat
    console.log('Aucune commune trouvée pour wilayaId:', wilayaId)
    return NextResponse.json({ wilayaId, communes: [] })
  } catch (err: any) {
    console.error('Erreur communes API:', err)
    return NextResponse.json({ message: err?.message ?? 'Erreur serveur' }, { status: 500 })
  }
}