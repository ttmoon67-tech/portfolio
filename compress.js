import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync } from 'fs'

const PUBLIC = 'public'
const MIN_SIZE_KB = 100 // only compress images > 100KB

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      files.push(...await walk(full))
    } else {
      files.push(full)
    }
  }
  return files
}

async function compress(p) {
  const s = await stat(p)
  const sizeKB = s.size / 1024
  const ext = p.split('.').pop().toLowerCase()

  if (sizeKB < MIN_SIZE_KB) return null
  if (!['png', 'jpg', 'jpeg'].includes(ext)) return null

  const before = sizeKB
  try {
    let pipeline = sharp(p)
    if (ext === 'png') {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 9, palette: true })
    } else {
      pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true })
    }
    // Resize if too large (max 2000px wide)
    const meta = await sharp(p).metadata()
    if (meta.width > 2000) {
      pipeline = pipeline.resize(2000, null, { withoutEnlargement: true })
    }

    const tmp = p + '.tmp'
    await pipeline.toFile(tmp)
    const after = (await stat(tmp)).size / 1024
    return { file: p, before, after, saved: before - after }
  } catch (e) {
    console.error(`  ✗ ${p}: ${e.message}`)
    return null
  }
}

async function main() {
  const files = await walk(PUBLIC)
  const images = files.filter(f => /\.(png|jpe?g)$/i.test(f))
  console.log(`Found ${images.length} images, checking ${MIN_SIZE_KB}KB+...\n`)

  const results = []
  for (const p of images) {
    const r = await compress(p)
    if (r) results.push(r)
  }

  // Apply successful compressions (replace originals with tmp files)
  let totalSaved = 0
  for (const r of results) {
    const tmp = r.file + '.tmp'
const { rename } = await import('fs/promises')
    await rename(tmp, r.file)
    console.log(`${r.file}: ${r.before.toFixed(0)}KB → ${r.after.toFixed(0)}KB (${((r.saved/r.before)*100).toFixed(0)}%)`)
    totalSaved += r.saved
  }

  console.log(`\nDone. ${results.length} files compressed, saved ${(totalSaved/1024).toFixed(1)}MB total.`)
}

main().catch(e => { console.error(e); process.exit(1) })
