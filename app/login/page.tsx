import LoginButton from '@/components/LoginButton'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{ background: 'var(--accent-glow)', border: '1px solid rgba(108,99,255,0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--accent)' }}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Smart Bookmarks
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Your private corner of the internet.</p>
        </div>
        <div className="rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-medium mb-1" style={{ color: 'var(--text)' }}>Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Sign in to access your bookmarks.</p>
          {searchParams.error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm"
              style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', color: 'var(--danger)' }}>
              Authentication failed. Please try again.
            </div>
          )}
          <LoginButton />
          <p className="mt-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            Bookmarks are private to your account only.
          </p>
        </div>
      </div>
    </main>
  )
}