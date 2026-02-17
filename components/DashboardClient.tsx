'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Bookmark } from '@/types'
import AddBookmarkForm from './AddBookmarkForm'
import BookmarkCard from './BookmarkCard'

interface Props { user: { id: string; email: string }; initialBookmarks: Bookmark[] }

export default function DashboardClient({ user, initialBookmarks }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [loggingOut, setLoggingOut] = useState(false)
  const supabase = createClient()

  // Function to fetch latest bookmarks from DB
  const fetchBookmarks = useCallback(async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setBookmarks(data as Bookmark[])
  }, [supabase])

  useEffect(() => {
    const channel = supabase.channel('bookmarks-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookmarks' },
        () => fetchBookmarks())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookmarks' },
        () => fetchBookmarks())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchBookmarks, supabase])

  const handleAdd = useCallback(async (title: string, url: string) => {
    const { error } = await supabase.from('bookmarks').insert({ title, url, user_id: user.id })
    if (error) throw new Error(error.message)
    // Manually refresh after insert in case realtime is slow
    await fetchBookmarks()
  }, [supabase, user.id, fetchBookmarks])

  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) throw new Error(error.message)
    // Manually refresh after delete in case realtime is slow
    await fetchBookmarks()
  }, [supabase, fetchBookmarks])

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Smart Bookmarks</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent' }}>
            {loggingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </header>

        <AddBookmarkForm onAdd={handleAdd} />

        <div className="flex items-center gap-2 mt-8 mb-4">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Your Bookmarks</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            {bookmarks.length}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--success)' }}/>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--success)' }}/>
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Live</span>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-2xl p-12 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>No bookmarks yet</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add your first bookmark using the form above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {bookmarks.map(b => <BookmarkCard key={b.id} bookmark={b} onDelete={handleDelete} />)}
          </div>
        )}
      </div>
    </div>
  )
}
