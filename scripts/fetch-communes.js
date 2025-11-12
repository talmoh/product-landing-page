const https = require('https')
const fs = require('fs')
const path = require('path')

const DEFAULT_URL = 'https://raw.githubusercontent.com/othmanus/algeria-cities/master/json/algeria_cities.json'
const url = process.argv[2] || DEFAULT_URL

const outPath = path.join(__dirname, '..', 'src', 'data', 'algeria_cities.json')
fs.mkdirSync(path.dirname(outPath), { recursive: true })

console.log('Téléchargement de :', url)
https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('Erreur HTTP', res.statusCode)
    process.exit(1)
  }
  const chunks = []
  res.on('data', c => chunks.push(c))
  res.on('end', () => {
    const body = Buffer.concat(chunks).toString('utf8')
    try {
      JSON.parse(body)
    } catch (err) {
      console.error('Le contenu téléchargé n\'est pas un JSON valide')
      process.exit(1)
    }
    fs.writeFileSync(outPath, body, 'utf8')
    console.log('Sauvegardé ->', outPath)
    process.exit(0)
  })
}).on('error', err => {
  console.error('Erreur réseau', err.message)
  process.exit(1)
})