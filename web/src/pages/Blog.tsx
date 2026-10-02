import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getPosts, formatDate, type PostMeta } from '../api'
import { useTitle } from '../useTitle'

export default function Blog() {
  useTitle('Writing')
  const [posts, setPosts] = useState<PostMeta[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getPosts().then(setPosts).catch(() => setError(true))
  }, [])

  return (
    <section>
      <h1>Writing</h1>
      <p className="lede">Notes on software, tools, and whatever I'm learning.</p>
      {error && <p className="notice">Couldn't load posts right now. Please try again shortly.</p>}
      {!posts && !error && <p className="muted">Loading…</p>}
      {posts?.length === 0 && <p className="muted">No posts yet.</p>}
      <div className="post-index">
        {posts?.map((p) => (
          <article key={p.slug}>
            <time dateTime={p.date}>{formatDate(p.date)}</time>
            <h2><Link to={`/blog/${p.slug}`}>{p.title}</Link></h2>
            {p.summary && <p>{p.summary}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}
