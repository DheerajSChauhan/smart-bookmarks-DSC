'use client'
import { useState } from 'react'
import type { Bookmark } from '@/types'

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

export default function BookmarkCard({ bookmark, onDelete }: { bookmark: Bookmark; onDelete: (id: string) => Promise<void> }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try { await onDelete(bookmark.id) } catch { setDeleting(false) }
  }

  return (
    <div className="group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-150"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', opacity: deleting ? 0.5 : 1 }}>
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://www.google.com/s2/favicons?domain=${getDomain(bookmark.url)}&sz=32`} alt="" width={16} height={16} />
      </div>
      <div className="flex-1 min-w-0">
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer"
          className="block text-sm font-medium truncate hover:underline" style={{ color: 'var(--text)' }}>
          {bookmark.title}
        </a>
        <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
          {getDomain(bookmark.url)}
        </span>
      </div>
      <button onClick={handleDelete} disabled={deleting}
        className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-lg transition-all"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,71,87,0.1)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
      </button>
    </div>
  )
}