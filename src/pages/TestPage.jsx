import React from 'react'

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>✅ Sportset Frontend LIVE!</h1>
      <p>Backend API: {import.meta.env.VITE_API_URL || 'http://localhost:8000'}</p>
      <p>React is rendering ✓</p>
      <button onClick={() => alert('Button works!')}>Test Button</button>
    </div>
  )
}
