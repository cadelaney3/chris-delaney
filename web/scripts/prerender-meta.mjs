// Runs after `vite build`. GitHub Pages only serves files that exist, so
// client-side routes like /projects used to come back as a 404 (rendered by
// 404.html). This writes a real dist/<route>/index.html for each page, each
// with its own title, description, and link-preview (Open Graph) tags that
// crawlers can read without running JavaScript. Also writes sitemap.xml, and
// robots.txt when the site is served from a domain root (it's ignored elsewhere).

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname))
const dist = path.join(root, 'dist')
const SITE_URL = (process.env.SITE_URL || 'https://chrisdelaney.dev').replace(/\/$/, '')

const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { site } = await vite.ssrLoadModule('/src/site.ts')
await vite.close()

const pages = [
  { route: '', title: site.name, description: `${site.tagline} Software engineer in ${site.location} building React/TypeScript frontends, JVM services, and LLM-powered features.` },
  { route: 'projects', title: 'Projects', description: 'Live translation, fault-tolerant LLM routing, analytics, and personal projects like a Montana hunt unit ranker.' },
  { route: 'resume', title: 'Resume', description: `Experience, skills, and education for ${site.name}, full-stack software engineer.` },
  { route: 'gallery', title: 'Gallery', description: 'Trail miles, snow days, and the wildlife I run into along the way in Montana.' },
  { route: 'contact', title: 'Contact', description: `Get in touch with ${site.name}.` },
  ...(site.showWriting ? [{ route: 'blog', title: 'Writing', description: 'Notes on software, tools, and whatever I am learning.' }] : []),
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function headTags({ route, title, description }) {
  const fullTitle = route ? `${title} · ${site.name}` : title
  const url = `${SITE_URL}/${route ? route + '/' : ''}`
  return {
    title: fullTitle,
    tags: [
      `<meta name="description" content="${esc(description)}" />`,
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${esc(site.name)}" />`,
      `<meta property="og:title" content="${esc(fullTitle)}" />`,
      `<meta property="og:description" content="${esc(description)}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:image" content="${SITE_URL}/og.png" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${esc(`${site.name}: ${site.tagline}`)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
    ].join('\n    '),
  }
}

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const render = (page, extra = '') => {
  const { title, tags } = headTags(page)
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace('</head>', `    ${tags}${extra}\n  </head>`)
}

for (const page of pages) {
  const dir = path.join(dist, page.route)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), render(page))
}

// Unknown paths still get the app (which shows its Not Found page), but
// search engines are told not to index them.
await writeFile(path.join(dist, '404.html'), render(pages[0], '\n    <meta name="robots" content="noindex" />'))

await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${SITE_URL}/${p.route ? p.route + '/' : ''}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
)

if (new URL(SITE_URL).pathname === '/') {
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`)
}

console.log(`prerendered ${pages.length} pages + 404.html and sitemap.xml`)
