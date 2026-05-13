import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { submitCheckin } from '../../api/mockApi'
import Button from '../../components/Button'
import Input from '../../components/Input'

const Q = [
  { id: 'energy', q: 'Hoe is je energie vergeleken met vorige maand?', opts: ['slechter', 'gelijk', 'beter'] },
  { id: 'sleep', q: 'Hoe slaap je?', opts: ['slecht', 'matig', 'goed'] },
  { id: 'stress', q: 'Hoe is je stressniveau?', opts: ['hoog', 'gemiddeld', 'laag'] },
  { id: 'sideEffects', q: 'Heb je bijwerkingen ervaren?', opts: ['ja', 'nee'] },
  { id: 'changeGoal', q: 'Wil je je doel aanpassen?', opts: ['ja', 'nee'] },
]

function OptionPicker({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0' }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          background: 'none', border: 'none', borderBottom: value === opt ? '2px solid var(--color-text)' : '2px solid transparent',
          padding: '8px 16px', fontSize: 'var(--font-size-body)', fontFamily: 'inherit',
          fontWeight: value === opt ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
          color: value === opt ? 'var(--color-text)' : 'var(--color-secondary)', cursor: 'pointer',
        }}>
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function CheckIn() {
  const [answers, setAnswers] = useState({})
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const { dispatch } = useApp()
  const navigate = useNavigate()

  const allAnswered = Q.every(q => answers[q.id])

  async function handleSubmit() {
    if (!allAnswered) return
    setLoading(true)
    await submitCheckin({ ...answers, details })
    dispatch({ type: 'SET_CHECKIN', payload: new Date().toISOString() })
    navigate('/dashboard')
  }

  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-display)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-1px', marginBottom: 'var(--space-xl)' }}>Hoe ging het deze maand?</h1>
      {Q.map(q => (
        <div key={q.id} style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ fontSize: 'var(--font-size-body)', marginBottom: '8px' }}>{q.q}</div>
          <OptionPicker options={q.opts} value={answers[q.id]} onChange={v => setAnswers(a => ({ ...a, [q.id]: v }))} />
        </div>
      ))}
      {answers.sideEffects === 'ja' && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Input textarea placeholder="Beschrijf je bijwerkingen" value={details} onChange={e => setDetails(e.target.value)} />
        </div>
      )}
      <Button onClick={handleSubmit} disabled={!allAnswered || loading}>{loading ? 'Versturen...' : 'Verstuur check-in'}</Button>
    </div>
  )
}
