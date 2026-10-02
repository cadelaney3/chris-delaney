const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')

export type PostMeta = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  readingMinutes: number
}

export type Post = PostMeta & { html: string }

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API_URL + path, init)
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, body.error ?? `Request failed (${res.status})`)
  return body as T
}

export const getPosts = () => request<PostMeta[]>('/api/posts')

export const getPost = (slug: string) => request<Post>(`/api/posts/${encodeURIComponent(slug)}`)

export const sendContact = (msg: { name: string; email: string; message: string; website: string }) =>
  request<{ status: string }>('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  })

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
