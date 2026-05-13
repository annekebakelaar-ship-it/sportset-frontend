import { useNavigate } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout({ children, showNav }) {
  const navigate = useNavigate()

  return (
    <div className={styles.layout}>
      {showNav && (
        <nav className={styles.nav}>
          <button className={styles.brand} onClick={() => navigate('/dashboard')}>
            Youcaps.ai
          </button>
          <button className={styles.navLink} onClick={() => navigate('/account/profile')}>
            Account
          </button>
        </nav>
      )}
      {children}
    </div>
  )
}
