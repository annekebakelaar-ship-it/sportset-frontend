import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import StepIndicator from '../../components/StepIndicator'
import Input from '../../components/Input'
import Button from '../../components/Button'

const GENDERS = ['man', 'vrouw', 'anders']
const DIETS = ['omnivoor', 'vegetarisch', 'veganistisch', 'glutenvrij']

function OptionRow({ options, value, onChange, label }) {
  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-secondary)', marginBottom: '8px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '0' }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              background: 'none', border: 'none', borderBottom: value === opt ? '2px solid var(--color-text)' : '2px solid transparent',
              padding: '8px 16px', fontSize: 'var(--font-size-body)', fontFamily: 'inherit',
              fontWeight: value === opt ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
              color: value === opt ? 'var(--color-text)' : 'var(--color-secondary)', cursor: 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ProfileStep() {
  const { state, dispatch } = useApp()
  const [age, setAge] = useState(state.profile?.age || '')
  const [gender, setGender] = useState(state.profile?.gender || '')
  const [diet, setDiet] = useState(state.profile?.diet || '')
  const navigate = useNavigate()

  const valid = age && gender && diet

  function handleSubmit(e) {
    e.preventDefault()
    if (!valid) return
    dispatch({ type: 'SET_PROFILE', payload: { age: Number(age), gender, diet } })
    navigate('/onboarding/analysis')
  }

  return (
    <div>
      <StepIndicator current={2} total={4} />
      <h1 style={{ fontSize: 'var(--font-size-display)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-1px', marginBottom: '8px' }}>Vertel iets over jezelf</h1>
      <p style={{ color: 'var(--color-subtitle)', marginBottom: 'var(--space-xl)' }}>Drie vragen. Geen account-spam, geen reclame.</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Input type="number" placeholder="Leeftijd" value={age} onChange={e => setAge(e.target.value)} min="16" max="100" />
        </div>
        <OptionRow label="Geslacht" options={GENDERS} value={gender} onChange={setGender} />
        <OptionRow label="Voeding" options={DIETS} value={diet} onChange={setDiet} />
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Button type="submit" disabled={!valid}>Analyseer mijn profiel</Button>
        </div>
      </form>
    </div>
  )
}
