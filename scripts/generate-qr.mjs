// Run with: node scripts/generate-qr.mjs
// Generates QR code SVGs into public/qr/ at build time.
import QRCode from 'qrcode'
import { mkdir, writeFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../public/qr')

const CRYPTOS = [
  { id: 'usdt-trc20', address: 'TWtfL74KCjAWCnD7gsj83J2pS9yzbAeqHu' },
  { id: 'trx',        address: 'TWtfL74KCjAWCnD7gsj83J2pS9yzbAeqHu' },
  { id: 'sol',        address: 'YOUR_SOLANA_ADDRESS_HERE' },
  { id: 'eth',        address: 'YOUR_ETH_ADDRESS_HERE' },
]

await mkdir(outDir, { recursive: true })

for (const { id, address } of CRYPTOS) {
  if (address.startsWith('YOUR_')) {
    console.log(`⚠  Skipping ${id} (placeholder address)`)
    continue
  }
  const svg = await QRCode.toString(address, {
    type: 'svg',
    margin: 1,
    color: { dark: '#111111', light: '#ffffff' },
    width: 200,
  })
  await writeFile(resolve(outDir, `${id}.svg`), svg)
  console.log(`✓  public/qr/${id}.svg`)
}
