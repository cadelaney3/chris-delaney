import { useState } from 'react'
import { photos } from '../gallery'
import { useTitle } from '../useTitle'
import Lightbox from '../Lightbox'

export default function Gallery() {
  useTitle('Gallery')
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="gallery-page">
      <h1>Gallery</h1>
      <p className="lede">Trail miles, snow days, and the wildlife I run into along the way.</p>
      <div className="gallery-grid">
        {photos.map((p, i) => (
          <figure key={p.slug}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`View larger: ${p.caption}`}>
              <img src={p.small} alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async" />
            </button>
            <figcaption>{p.caption}</figcaption>
          </figure>
        ))}
      </div>
      <Lightbox photos={photos} index={open} onChange={setOpen} />
    </section>
  )
}
