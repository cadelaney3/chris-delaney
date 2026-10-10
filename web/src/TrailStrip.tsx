import { useState } from 'react'
import { Link } from 'react-router'
import { photos } from './gallery'
import Lightbox from './Lightbox'

const featured = photos.filter((p) => p.featured).slice(0, 4)

// A row of featured photos on the home page that opens the same viewer.
export default function TrailStrip() {
  const [open, setOpen] = useState<number | null>(null)
  if (featured.length === 0) return null

  return (
    <section>
      <div className="section-head">
        <h2>From the trail</h2>
        <Link to="/gallery">Full gallery →</Link>
      </div>
      <div className="trail-strip">
        {featured.map((p, i) => (
          <button key={p.slug} type="button" onClick={() => setOpen(i)} aria-label={`View larger: ${p.caption}`}>
            <img src={p.small} alt={p.alt} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <Lightbox photos={featured} index={open} onChange={setOpen} />
    </section>
  )
}
