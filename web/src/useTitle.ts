import { useEffect } from 'react'
import { site } from './site'

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.name}` : site.name
  }, [title])
}
