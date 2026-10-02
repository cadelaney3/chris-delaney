import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError, getPost, formatDate, type Post } from '../api'
import { useTitle } from '../useTitle'
import NotFound from './NotFound'

export default function PostPage() {
  const { slug = '' } = useParams()
  return <PostView key={slug} slug={slug} />
}

function PostView({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState<'missing' | 'failed' | null>(null)
  useTitle(post?.title)

  useEffect(() => {
    let current = true
    getPost(slug)
      .then((p) => current && setPost(p))
      .catch((e) => current && setError(e instanceof ApiError && e.status === 404 ? 'missing' : 'failed'))
    return () => { current = false }
  }, [slug])

  if (error === 'missing') return <NotFound />
  if (error) return <p className="notice">Couldn't load this post. Please try again shortly.</p>
  if (!post) return <p className="muted">Loading…</p>

  return (
    <article className="post">
      <Link to="/blog" className="back">← All writing</Link>
      <header>
        <h1>{post.title}</h1>
        <p className="muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
        </p>
      </header>
      {/* HTML is rendered by our own API from Markdown files in the repo. */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      {post.tags.length > 0 && (
        <ul className="tags">{post.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      )}
    </article>
  )
}
