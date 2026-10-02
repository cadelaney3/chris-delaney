import { Link } from 'react-router'
import { useTitle } from '../useTitle'

export default function NotFound() {
  useTitle('Not found')
  return (
    <section>
      <h1>Page not found</h1>
      <p className="lede">That page doesn't exist, or it moved.</p>
      <Link to="/">← Back home</Link>
    </section>
  )
}
