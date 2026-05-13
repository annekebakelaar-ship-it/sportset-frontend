import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { getDeliveryDate } from '../../api/mockApi'
import Label from '../../components/Label'
import Button from '../../components/Button'
import scannerStyles from '../scanner/Scanner.module.css'

/**
 * Dashboard
 * ---------
 * Hoofdscherm na opstart. De primaire actie is "Scan Supplement"
 * (live camera-scanner via /scanner). De onboarding- en abonnement-
 * flows zijn niet verwijderd, maar "geparkeerd" — bereikbaar via een
 * kleine, verborgen knop onderaan ("Bekijk Onboarding") voor demo's
 * aan investeerders.
 */
export default function Dashboard() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [delivery, setDelivery] = useState('')
  const [showDevMenu, setShowDevMenu] = useState(false)

  useEffect(() => { getDeliveryDate().then(setDelivery) }, [])

  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-display)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-1px', marginBottom: 'var(--space-xl)' }}>
        Hallo {state.user?.name || 'daar'}
      </h1>

      {/* ---------- Prominente Scan Supplement CTA (Glassmorphism) ---------- */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <button
          type="button"
          className={scannerStyles.dashCta}
          onClick={() => navigate('/scanner')}
          aria-label="Scan een supplement met je camera"
        >
          <span className={scannerStyles.dashCtaIcon} aria-hidden="true">📷</span>
          <span className={scannerStyles.dashCtaText}>
            <span className={scannerStyles.dashCtaTitle}>Scan Supplement</span>
            <span className={scannerStyles.dashCtaSub}>
              Gebruik je camera om een etiket te lezen en interacties te checken.
            </span>
          </span>
          <span className={scannerStyles.dashCtaArrow} aria-hidden="true">→</span>
        </button>
      </section>

      {state.formula && state.formula.length > 0 && (
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <Label>Deze maand</Label>
          <div style={{ marginTop: 'var(--space-sm)' }}>
            {state.formula.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{s.name}</div>
                  <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-secondary)', marginTop: '2px' }}>{s.desc}</div>
                </div>
                <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-secondary)' }}>{s.dose}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <Label>Voortgang</Label>
        <div style={{ marginTop: 'var(--space-sm)' }}>
          {state.lastCheckin
            ? <p style={{ color: 'var(--color-secondary)', fontSize: 'var(--font-size-body)' }}>Volgende formule wordt aangepast op basis van je laatste check-in.</p>
            : <Button onClick={() => navigate('/checkin')}>Doe je maandelijkse check-in</Button>
          }
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <Label>Volgende levering</Label>
        <div style={{ marginTop: 'var(--space-sm)' }}>
          <p style={{ marginBottom: 'var(--space-sm)' }}>{delivery || 'Laden...'}</p>
          <Button onClick={() => navigate('/account/subscription')}>Levering beheren</Button>
        </div>
      </section>

      {/* ---------- Verborgen instellingen / demo-menu ---------- */}
      {/*
        Heel klein, neutraal, onderaan. Bedoeld voor demo's aan
        investeerders zodat de geparkeerde onboarding-flow op
        verzoek getoond kan worden. Niet prominent — niet voor
        eindgebruikers.
      */}
      <section style={{ marginTop: 'var(--space-xxl)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <button
          type="button"
          onClick={() => setShowDevMenu(v => !v)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-label)',
            fontSize: 'var(--font-size-micro)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-expanded={showDevMenu}
          aria-controls="dev-menu"
        >
          {showDevMenu ? '· instellingen verbergen' : '· instellingen'}
        </button>

        {showDevMenu && (
          <div
            id="dev-menu"
            style={{
              marginTop: 'var(--space-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'flex-start',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/onboarding/goal')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-secondary)',
                fontSize: 'var(--font-size-small)',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Bekijk Onboarding
            </button>
            <button
              type="button"
              onClick={() => navigate('/onboarding/subscribe')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-secondary)',
                fontSize: 'var(--font-size-small)',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Bekijk Abonnement-flow
            </button>
            <button
              type="button"
              onClick={() => navigate('/signin')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-secondary)',
                fontSize: 'var(--font-size-small)',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Bekijk Sign-in scherm
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
