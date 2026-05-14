import { useState, useEffect } from 'react'

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking')
  const [error, setError] = useState(null)

  useEffect(() => {
    checkBackendStatus()
  }, [])

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('https://sportset-backend.onrender.com/health')
      if (response.ok) {
        setApiStatus('connected')
      } else {
        setApiStatus('failed')
        setError(`HTTP ${response.status}`)
      }
    } catch (err) {
      setApiStatus('failed')
      setError(err.message)
    }
  }

  const handleConnectOura = () => {
    alert('Connect Oura button clicked - mock action')
  }

  return (
    <div className="container">
      <header className="hero">
        <h1>Sportset</h1>
        <p>Health & Fitness Dashboard</p>
      </header>

      <main className="dashboard">
        <div className="status-card">
          <h2>Backend Status</h2>
          <div className="status-indicator">
            {apiStatus === 'checking' && (
              <span className="status-badge checking">⏳ Checking...</span>
            )}
            {apiStatus === 'connected' && (
              <span className="status-badge connected">✅ Connected</span>
            )}
            {apiStatus === 'failed' && (
              <span className="status-badge failed">❌ Failed</span>
            )}
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="action-section">
          <button 
            className="cta-button"
            onClick={handleConnectOura}
          >
            Connect Oura
          </button>
        </div>
      </main>

      <footer>
        <p>&copy; 2026 Sportset MVP</p>
      </footer>
    </div>
  )
}
