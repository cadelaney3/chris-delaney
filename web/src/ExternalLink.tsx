import type { ReactNode } from 'react'

// Opens web links in a new tab. mailto: links stay put, since a new tab would
// just be left blank while the mail app opens.
export default function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith('mailto:')) return <a href={href}>{children}</a>
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}
