import { useState, useEffect } from 'react'
import Label from '../../components/Label'

const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

function Mono({ children }) {
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-small)' }}>
      {children}
    </span>
  )
}

function TextButton({ onClick, href, disabled, children }) {
  const style = {
    background: 'none',
    border: 'none',
    fontSize: 'var(--font-size-body)',
    cursor: disabled ? 'default' : 'pointer',
    padding: 0,
    textDecoration: disabled ? 'none' : 'underline',
    color: disabled ? 'var(--color-secondary)' : 'var(--color-text)',
    fontFamily: 'inherit',
  }
  if (href) return <a href={href} style={style}>{children}</a>
  return <button onClick={onClick} disabled={disabled} style={style}>{children}</button>
}

function formatExpiry(iso) {
  return new Date(iso).toLocaleString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function Connect() {
  const [status, setStatus] = useState(null)   // null = loading
  const [pullResult, setPullResult] = useState(null)
  const [pulling, setPulling] = useState(false)
  const [error, setError] = useState(null)     // 'expired' | 'api_error' | 'no_data'

  useEffect(() => {
    // Clear status=success query param left by OAuth callback redirect
    const params = new URLSearchParams(window.location.search)
    if (params.get('status') === 'success') {
      window.history.replaceState({}, '', '/connect')
    }

    fetch(`${BASE}/api/oura/status`)
      .then(r => r.json())
      .then(setStatus)
      .catch(() => setStatus({ connected: false }))
  }, [])

  async function handlePull() {
    setPulling(true)
    setError(null)
    setPullResult(null)
    try {
      const res = await fetch(`${BASE}/api/oura/pull`, { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.detail === 'not_connected' ? 'expired' : 'api_error')
        return
      }
      const data = await res.json()
      // PRIVACY: raw biometric data lives only in sessionStorage, never sent to our server.
      sessionStorage.setItem('oura_pulled_data', JSON.stringify(data))

      const points = data.data
      const nonNull = (field) => points.filter(p => p[field] !== null).length

      const coverage = {
        total:    points.length,
        hrv:      nonNull('hrv_ms'),
        sleep:    nonNull('total_sleep_min'),
        activity: nonNull('steps'),
        temp:     nonNull('wrist_temp_deviation_c'),
        pulled_at: data.pulled_at,
      }

      if (coverage.hrv === 0 && coverage.sleep === 0 && coverage.activity === 0) {
        setError('no_data')
        return
      }

      setPullResult(coverage)
    } catch {
      setError('api_error')
    } finally {
      setPulling(false)
    }
  }

  const section = { marginBottom: 'var(--space-xl)' }
  const sectionBody = { marginTop: 'var(--space-xs)' }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 'var(--space-lg) var(--container-padding)' }}>
      <Label>INTERN · WEARABLE-KOPPELING</Label>

      <h1 style={{
        fontSize: 'var(--font-size-display)',
        fontWeight: 'var(--font-weight-semibold)',
        letterSpacing: '-1px',
        margin: 'var(--space-md) 0 var(--space-xl)',
      }}>
        Oura Ring koppelen
      </h1>

      {/* ── Status ── */}
      <section style={section}>
        <Label>STATUS</Label>
        <div style={sectionBody}>
          {status === null && (
            <p style={{ color: 'var(--color-secondary)', fontSize: 'var(--font-size-body)' }}>
              Laden...
            </p>
          )}
          {status && !status.connected && (
            <p style={{ fontSize: 'var(--font-size-body)' }}>Niet gekoppeld</p>
          )}
          {status?.connected && (
            <p style={{ fontSize: 'var(--font-size-body)' }}>
              <Mono>Gekoppeld · token verloopt {formatExpiry(status.expires_at)}</Mono>
            </p>
          )}
        </div>

        {status && !status.connected && error !== 'expired' && (
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <TextButton href={`${BASE}/api/oura/connect`}>Koppel Oura</TextButton>
          </div>
        )}

        {error === 'expired' && (
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <p style={{ color: 'var(--color-secondary)', fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-xs)' }}>
              Verbinding verlopen. Koppel Oura opnieuw.
            </p>
            <TextButton href={`${BASE}/api/oura/connect`}>Koppel Oura</TextButton>
          </div>
        )}
        {error === 'api_error' && (
          <p style={{ marginTop: 'var(--space-xs)', color: 'var(--color-secondary)', fontSize: 'var(--font-size-body)' }}>
            Oura is op dit moment niet bereikbaar. Probeer het later opnieuw.
          </p>
        )}
        {error === 'no_data' && (
          <p style={{ marginTop: 'var(--space-xs)', color: 'var(--color-secondary)', fontSize: 'var(--font-size-body)' }}>
            Geen data gevonden in de afgelopen 45 dagen. Draag je je Oura wel?
          </p>
        )}
      </section>

      {/* ── Data ophalen ── */}
      {status?.connected && (
        <section style={section}>
          <Label>DATA OPHALEN</Label>
          <div style={sectionBody}>
            <TextButton onClick={handlePull} disabled={pulling}>
              {pulling ? 'Bezig met ophalen...' : 'Trek 45 dagen aan data'}
            </TextButton>
          </div>
        </section>
      )}

      {/* ── Resultaat ── */}
      {pullResult && (
        <section style={section}>
          <Label>RESULTAAT</Label>
          <div style={sectionBody}>
            <p style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--space-xs)' }}>
              <Mono>{pullResult.total} dagen opgehaald · {formatDate(pullResult.pulled_at)}</Mono>
            </p>
            <ul style={{
              listStyle: 'none', padding: 0, margin: '0 0 var(--space-sm)',
              color: 'var(--color-secondary)',
              fontSize: 'var(--font-size-small)',
              lineHeight: 1.8,
            }}>
              <li>— HRV beschikbaar voor {pullResult.hrv} dagen</li>
              <li>— Slaap beschikbaar voor {pullResult.sleep} dagen</li>
              <li>— Activiteit beschikbaar voor {pullResult.activity} dagen</li>
              <li>— Polstemp beschikbaar voor {pullResult.temp} dagen</li>
            </ul>
            <TextButton href="/preview?source=oura">
              Genereer maandaanpassing met deze data →
            </TextButton>
          </div>
        </section>
      )}
    </div>
  )
}
