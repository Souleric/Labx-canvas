'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    router.push('/editor')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f4f5f7', fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: '#fff', borderRadius: '14px', padding: '40px 36px',
        boxShadow: '0 8px 40px rgba(11,31,58,.12)', width: '100%', maxWidth: '380px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#0b1f3a', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="1" fill="white"/>
              <rect x="11" y="2" width="7" height="7" rx="1" fill="white"/>
              <rect x="2" y="11" width="7" height="7" rx="1" fill="white"/>
              <rect x="11" y="11" width="7" height="3" rx="1" fill="white" opacity=".6"/>
              <rect x="11" y="15" width="7" height="3" rx="1" fill="white" opacity=".3"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0b1f3a', letterSpacing: '.3px' }}>LabX Canvas</div>
            <div style={{ fontSize: '11px', color: '#6b7a96' }}>Website Studio</div>
          </div>
        </div>

        <div style={{ fontSize: '20px', fontWeight: '700', color: '#0b1f3a', marginBottom: '6px' }}>Sign in</div>
        <div style={{ fontSize: '13px', color: '#6b7a96', marginBottom: '24px' }}>Access your website editor</div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#0b1f3a', display: 'block', marginBottom: '5px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              style={{
                width: '100%', padding: '10px 12px', border: '1.5px solid #dde3ed',
                borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit',
                outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s'
              }}
              onFocus={e => e.target.style.borderColor = '#1553a0'}
              onBlur={e => e.target.style.borderColor = '#dde3ed'}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#0b1f3a', display: 'block', marginBottom: '5px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 12px', border: '1.5px solid #dde3ed',
                borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit',
                outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s'
              }}
              onFocus={e => e.target.style.borderColor = '#1553a0'}
              onBlur={e => e.target.style.borderColor = '#dde3ed'}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '7px', fontSize: '13px', color: '#dc2626'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px', background: loading ? '#94a3b8' : '#0b1f3a', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px',
              transition: 'background .15s'
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#6b7a96' }}>
          Need access? Contact your account manager.
        </div>
      </div>
    </div>
  )
}
