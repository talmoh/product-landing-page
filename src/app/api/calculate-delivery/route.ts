import { NextResponse } from 'next/server'

const WILAYA_COSTS: Record<string, number> = {
  "1": 1050, "2": 600, "3": 600, "4": 600, "5": 600, "6": 600, "7": 750, "8": 750,
  "9": 450, "10": 600, "11": 1250, "12": 750, "13": 600, "14": 600, "15": 600,
  "16": 400, "17": 750, "18": 600, "19": 600, "20": 600, "21": 600, "22": 600,
  "23": 600, "24": 600, "25": 600, "26": 600, "27": 600, "28": 600, "29": 600,
  "30": 750, "31": 600, "32": 1050, "33": 1250, "34": 600, "35": 450, "36": 600,
  "37": 1250, "38": 600, "39": 750, "40": 600, "41": 600, "42": 600, "43": 600,
  "44": 600, "45": 1050, "46": 600, "47": 750, "48": 600
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const wilayaId = String(body?.wilayaId ?? '')
    if (!wilayaId || !(wilayaId in WILAYA_COSTS)) {
      return NextResponse.json({ message: 'wilayaId invalide' }, { status: 400 })
    }

    const cost = WILAYA_COSTS[wilayaId]
    return NextResponse.json({ wilayaId, cost })
  } catch (err: any) {
    return NextResponse.json({ message: err?.message ?? 'Erreur serveur' }, { status: 500 })
  }
}