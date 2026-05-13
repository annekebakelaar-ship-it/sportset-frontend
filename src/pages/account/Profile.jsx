import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Label from '../../components/Label'

export default function Profile() {
  const { state, dispatch } = useApp()
  const [age, setAge] = useState(state.profile?.age || '')
  const [gender, setGender] = useState(state.profile?.gender || '')
  const [activity, setActivity] = useState(state.profile?.activity || '')
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    dispatch({ type: 'SET_PROFILE', payload: { age: Number(age), gender, activity } })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-display)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-1px', marginBottom: 'var(--space-xl)' }}>Profiel</h1>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Label>E-mail</Label>
          <p style={{ padding: '10px 0', color: 'var(--color-secondary)' }}>{state.user?.email}</p>
        </div>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Input label="Leeftijd" type="number" value={age} onChange={e => setAge(e.target.value)} />
        </div>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Input label="Geslacht" value={gender} onChange={e => setGender(e.target.value)} />
        </div>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Input label="Activiteitsniveau" value={activity} onChange={e => setActivity(e.target.value)} />
        </div>
        <Button type="submit">Opslaan</Button>
        {saved && <span style={{ marginLeft: '16px', color: 'var(--color-secondary)', fontSize: 'var(--font-size-small)' }}>Opgeslagen</span>}
      </form>
    </div>
  )
}
