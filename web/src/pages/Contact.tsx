import { useState, type FormEvent } from 'react'
import { sendContact } from '../api'
import { useTitle } from '../useTitle'

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }

export default function Contact() {
  useTitle('Contact')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus({ kind: 'sending' })
    try {
      await sendContact({
        name: String(data.get('name')),
        email: String(data.get('email')),
        message: String(data.get('message')),
        website: String(data.get('website') ?? ''),
      })
      form.reset()
      setStatus({ kind: 'sent' })
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    }
  }

  return (
    <section>
      <h1>Contact</h1>
      <p className="lede">Have a question, an opportunity, or just want to say hi? Send a note and I'll get back to you.</p>

      {status.kind === 'sent' ? (
        <p className="notice success">Thanks, your message is on its way. I'll reply soon.</p>
      ) : (
        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            Name
            <input name="name" required maxLength={100} autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required maxLength={254} autoComplete="email" />
          </label>
          <label>
            Message
            <textarea name="message" required maxLength={5000} rows={6} />
          </label>
          {/* Honeypot: hidden from people, filled in by bots. */}
          <label className="hp" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          {status.kind === 'error' && <p className="notice error" role="alert">{status.message}</p>}
          <button type="submit" disabled={status.kind === 'sending'}>
            {status.kind === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </section>
  )
}
