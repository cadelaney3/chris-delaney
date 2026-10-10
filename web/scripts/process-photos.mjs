// Turns the originals in src/assets/photos (gitignored: they carry GPS data)
// into web-sized, metadata-free copies in public/photos, and records their
// dimensions in src/gallery-sizes.json so the grid can reserve space.
//
//   npm run photos

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname))
const srcDir = path.join(root, 'src/assets/photos')
const outDir = path.join(root, 'public/photos')

// Photos with black letterbox bars to crop off.
const TRIM = new Set(['img-7470'])

// Crops near-black bars off the top and bottom by scanning row brightness.
async function cropLetterbox(img) {
  const buf = await img.toBuffer()
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true })
  const dark = (y) => {
    let sum = 0
    for (let x = 0; x < info.width; x++) sum += data[y * info.width + x]
    return sum / info.width < 18
  }
  let top = 0
  while (top < info.height - 1 && dark(top)) top++
  let bottom = info.height - 1
  while (bottom > top && dark(bottom)) bottom--
  return sharp(buf).extract({ left: 0, top, width: info.width, height: bottom - top + 1 })
}

const slugOf = (file) => path.parse(file).name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const files = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f)).sort()
const sizes = {}

for (const file of files) {
  const slug = slugOf(file)
  // rotate() applies the EXIF orientation; sharp drops all other metadata
  // (GPS included) unless asked to keep it.
  let base = sharp(path.join(srcDir, file)).rotate()
  if (TRIM.has(slug)) base = await cropLetterbox(base)

  const lg = await base.clone().resize(1800, 1800, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(outDir, `${slug}-lg.webp`))
  const sm = await base.clone().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(outDir, `${slug}-sm.webp`))
  sizes[slug] = { w: sm.width, h: sm.height }
  console.log(`${file} → ${slug} (${lg.width}×${lg.height}, ${Math.round(lg.size / 1024)} KB / ${Math.round(sm.size / 1024)} KB)`)
}

await writeFile(path.join(root, 'src/gallery-sizes.json'), JSON.stringify(sizes, null, 2) + '\n')
console.log(`\n${files.length} photos written to public/photos`)
