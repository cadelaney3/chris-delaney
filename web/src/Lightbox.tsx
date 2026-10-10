import { useEffect, useRef } from 'react'
import type { GalleryPhoto } from './gallery'

type Props = {
  photos: GalleryPhoto[]
  index: number | null
  onChange: (index: number | null) => void
}

// Full-screen photo viewer built on <dialog>, which handles focus trapping
// and Escape for us. Arrow keys and the side buttons step through photos.
export default function Lightbox({ photos, index, onChange }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const open = index !== null
  const photo = open ? photos[index] : null

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onChange((index + 1) % photos.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, photos.length, onChange])

  // Preload neighbors so stepping through feels instant.
  useEffect(() => {
    if (!open) return
    for (const i of [index + 1, index - 1]) new Image().src = photos[(i + photos.length) % photos.length].large
  }, [open, index, photos])

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={photo?.caption}
      onClose={() => onChange(null)}
      onClick={(e) => e.target === e.currentTarget && onChange(null)}
    >
      {photo && (
        <>
          <figure>
            <img src={photo.large} alt={photo.alt} />
            <figcaption>
              {photo.caption}
              <span className="lightbox-count">{index! + 1} / {photos.length}</span>
            </figcaption>
          </figure>
          <button type="button" className="lightbox-btn prev" aria-label="Previous photo" onClick={() => onChange((index! - 1 + photos.length) % photos.length)}>‹</button>
          <button type="button" className="lightbox-btn next" aria-label="Next photo" onClick={() => onChange((index! + 1) % photos.length)}>›</button>
          <button type="button" className="lightbox-btn close" aria-label="Close" onClick={() => onChange(null)}>×</button>
        </>
      )}
    </dialog>
  )
}
