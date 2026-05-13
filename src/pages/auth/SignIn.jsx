import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../../components/Button'
import Input from '../../components/Input'

const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const IS_DEV = import.meta.env.DEV

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { dispatch } = useApp()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await fetch(`${BASE}/auth/request-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleDevLogin() {
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/auth/dev-token`)
      const { access_token } = await res.json()
      localStorage.setItem('youcaps_token', access_token)
      dispatch({ type: 'SET_USER', payload: { email: 'dev@youcaps.ai' } })
      navigate('/onboarding/goal')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--space-xl) var(--container-padding)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: 'var(--font-size-display)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-1px', marginBottom: '8px' }}>Check je mail</h1>
        <p style={{ color: 'var(--color-subtitle)', fontSize: 'var(--font-size-body)' }}>
          We hebben een inloglink gestuurd naar <strong>{email}</strong>. De link is 15 minuten geldig.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--space-xl) var(--container-padding)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: 'var(--font-size-display)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-1px', marginBottom: '8px' }}>Welkom terug</h1>
      <p style={{ color: 'var(--color-subtitle)', fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-xl)' }}>Log in met het e-mailadres waarmee je je hebt aangemeld.</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Input type="email" placeholder="E-mailadres" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" disabled={loading || !email.trim()}>
          {loading ? 'Laden...' : 'Stuur inloglink'}
        </Button>
      </form>

      {IS_DEV && (
        <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '8px', fontFamily: 'monospace' }}>DEV</p>
          <button
            onClick={handleDevLogin}
            disabled={loading}
            style={{ background: 'none', border: '1px solid #ddd', borderRadius: '4px', padding: '8px 16px', fontSize: 'var(--font-size-small)', fontFamily: 'inherit', cursor: 'pointer', color: 'var(--color-secondary)' }}
          >
            Dev login (dev@youcaps.ai)
          </button>
        </div>
      )}
    </div>
  )
}
