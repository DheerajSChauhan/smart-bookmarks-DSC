'use client'
import { useState } from 'react'

export default function AddBookmarkForm({ onAdd }: { onAdd: (title: string, url: string) => Promise<void> }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !url.trim()) return setError('Both fields are required.')
    let finalUrl = url.trim()
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl
    try { new URL(finalUrl) } catch { return setError('Please enter a valid URL.') }
    setLoading(true)
    try {
      await onAdd(title.trim(), finalUrl)
      setTitle(''); setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bookmark.')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text)' }}>Add Bookmark</h2>
      <div className="flex flex-col gap-3">
        <input id="title" name="title" type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
          disabled={loading} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
        <input id="url" name="url" type="text" placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)}
          disabled={loading} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
        {error && <p className="text-xs px-3 py-2 rounded-lg" style={{ color: 'var(--danger)', background: 'rgba(255,71,87,0.08)' }}>{error}</p>}
        <button type="submit" disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
          style={{ background: 'var(--accent)', color: 'white' }}>
          {loading ? 'Adding…' : '+ Add Bookmark'}
        </button>
      </div>
    </form>
  )
}