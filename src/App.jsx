import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import TestPage from './pages/TestPage'
import SignIn from './pages/auth/SignIn'
import GoalStep from './pages/onboarding/GoalStep'
import ProfileStep from './pages/onboarding/ProfileStep'
import AnalysisStep from './pages/onboarding/AnalysisStep'
import FormulaStep from './pages/onboarding/FormulaStep'
import SubscribeStep from './pages/onboarding/SubscribeStep'
import Dashboard from './pages/dashboard/Dashboard'
import CheckIn from './pages/checkin/CheckIn'
import Scanner from './pages/scanner/Scanner'
import Profile from './pages/account/Profile'
import Subscription from './pages/account/Subscription'
import Connect from './pages/connect/Connect'

/**
 * Router configuratie
 * -------------------
 * Voor de development-/investor-demo starten we direct op het Dashboard ("/")
 * met de Scanner-CTA. De auth- en onboarding-flow blijven volledig bestaan
 * en zijn bereikbaar via:
 *   /signin              — login-scherm
 *   /onboarding/goal     — start van de onboarding (5 stappen)
 *   /onboarding/profile  …
 *   /onboarding/analysis …
 *   /onboarding/formula  …
 *   /onboarding/subscribe…
 *
 * Vanuit het Dashboard kun je via de verborgen "Bekijk Onboarding"-knop
 * de demo-flow starten. Niets is verwijderd — alleen "geparkeerd".
 */

export default function App() {
  return (
    <Routes>
      {/* Test page */}
      <Route path="/" element={<TestPage />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      {/* Scanner — hoofdfunctionaliteit */}
      <Route path="/scanner" element={<Layout showNav><Scanner /></Layout>} />

      {/* Geparkeerde flows — blijven bereikbaar voor demo's */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/onboarding/goal" element={<Layout><GoalStep /></Layout>} />
      <Route path="/onboarding/profile" element={<Layout><ProfileStep /></Layout>} />
      <Route path="/onboarding/analysis" element={<Layout><AnalysisStep /></Layout>} />
      <Route path="/onboarding/formula" element={<Layout><FormulaStep /></Layout>} />
      <Route path="/onboarding/subscribe" element={<Layout><SubscribeStep /></Layout>} />

      {/* Overige bestaande pagina's */}
      <Route path="/checkin" element={<Layout showNav><CheckIn /></Layout>} />
      <Route path="/account/profile" element={<Layout showNav><Profile /></Layout>} />
      <Route path="/account/subscription" element={<Layout showNav><Subscription /></Layout>} />

      {/* Wearable koppeling (Fase 4) */}
      <Route path="/connect" element={<Layout showNav><Connect /></Layout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
