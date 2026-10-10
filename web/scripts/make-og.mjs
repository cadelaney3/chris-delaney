// Renders the link-preview image (public/og.png, 1200×630) from the same
// ridgeline artwork as the home page. Re-run after changing the name,
// tagline, or Ridgeline.tsx:
//
//   npm run og

import { createServer } from 'vite'
import { createRequire } from 'node:module'
import path from 'node:path'
import sharp from 'sharp'

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname))
const require = createRequire(path.join(root, 'package.json'))
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')

const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { HeroRidge } = await vite.ssrLoadModule('/src/Ridgeline.tsx')
const { site } = await vite.ssrLoadModule('/src/site.ts')
await vite.close()

// Pull the inner drawing out of the hero's <svg> so it can be nested here.
const hero = renderToStaticMarkup(React.createElement(HeroRidge))
const inner = hero.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1]

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const url = 'cadelaney3.github.io/chris-delaney'

// Light-theme colors from index.css. Rockwell (macOS) stands in for Zilla Slab.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3efe4"/><stop offset="1" stop-color="#e3e8dc"/>
    </linearGradient>
    <style>
      .sun { fill: #e7b46a } .far { fill: #cdd5c4 } .mid { fill: #9cb09a } .near { fill: #2f5d3a }
      .snow { fill: #fbfaf6 } .elk { fill: #a8703c } .deer { fill: #8a5630 }
      .antlers { stroke: #6b4626 } .shadow { fill: rgb(0 0 0 / 0.18) }
    </style>
  </defs>
  <rect width="1200" height="630" fill="url(#sky)"/>
  <text x="80" y="150" font-family="Rockwell, 'Zilla Slab', Georgia, serif" font-weight="700" font-size="86" fill="#1d2620">${escape(site.name)}</text>
  <text x="82" y="215" font-family="'Helvetica Neue', Inter, Arial, sans-serif" font-size="36" fill="#3f4c42">${escape(site.tagline)}</text>
  <text x="82" y="268" font-family="'Helvetica Neue', Inter, Arial, sans-serif" font-size="24" fill="#2f5d3a">${escape(url)}</text>
  <svg x="0" y="330" width="1200" height="300" viewBox="0 0 720 180" preserveAspectRatio="xMidYMax slice">${inner}</svg>
</svg>`

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(root, 'public/og.png'))
console.log('wrote public/og.png')
