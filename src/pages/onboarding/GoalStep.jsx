import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { GOALS } from '../../api/mockData'
import StepIndicator from '../../components/StepIndicator'
import Button from '../../components/Button'

export default function GoalStep() {
  const { state, dispatch } = useApp()
  const [selected, setSelected] = useState(state.goal || null)
  const navigate = useNavigate()

  function handleNext() {
    if (!selected) return
    dispatch({ type: 'SET_GOAL', payload: selected })
    navigate('/onboarding/profile')
  }

  return (
    <div>
      <StepIndicator current={1} total={4} />
      <h1 style={{ fontSize: 'var(--font-size-display)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-1px', marginBottom: '8px' }}>Wat wil je bereiken?</h1>
      <p style={{ color: 'var(--color-subtitle)', marginBottom: 'var(--space-xl)' }}>Kies een doel. Je kunt dit later aanpassen.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {GOALS.map(g => (
          <button
            key={g.id}
            onClick={() => setSelected(g.id)}
            style={{
              background: 'none',
              border: 'none',
              borderLeft: selected === g.id ? '2px solid var(--color-text)' : '2px solid transparent',
              padding: '14px 16px',
              textAlign: 'left',
              fontSize: 'var(--font-size-body)',
              fontWeight: selected === g.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              borderBottom: '1px solid var(--color-border-subtle)',
              fontFamily: 'inherit',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <Button onClick={handleNext} disabled={!selected}>Volgende</Button>
      </div>
    </div>
  )
}
