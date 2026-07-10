import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import GoogleSignInButton from '../../components/GoogleSignInButton'
import styles from '../auth.module.css'

function Login({ onRegister, onSuccess }) {
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim() || !password) {
      setError('Enter your phone number or email and password')
      return
    }

    setLoading(true)
    try {
      login({ identifier, password })
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Log in to DRIVE2</h1>

        <div className={styles.card}>
          {error && <p className={styles.error}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              placeholder="Phone or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
            />

            <div className={styles.passwordRow}>
              <input
                className={styles.input}
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className={styles.forgot}>
               Forgot?
              </button>
            </div>

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? 'Login…' : 'Login'}
            </button>
          </form>

          <div className={styles.divider}>or</div>

          <button type="button" className={`${styles.socialBtn} ${styles.apple}`}>
            <span className={styles.socialIcon}></span>
           Continue with Apple
          </button>
          <GoogleSignInButton onSuccess={onSuccess} />
        </div>

        <div className={styles.secondaryCard}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onRegister}
          >
            Register
          </button>
        </div>

        <p className={styles.legal}>
          By continuing, you agree to{' '}
          <a href="#">User agreement</a>,{' '}
          <a href="#">Privacy Policy</a> and{' '}
          <a href="#">Site Rules</a>.
        </p>
      </div>
    </main>
  )
}

export default Login
