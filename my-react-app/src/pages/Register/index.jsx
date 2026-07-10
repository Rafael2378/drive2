import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import GoogleSignInButton from '../../components/GoogleSignInButton'
import styles from '../auth.module.css'

function Register({ onLogin, onSuccess }) {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !phone.trim() || !password) {
      setError('Заполните все поля')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }

    setLoading(true)
    try {
      register({ email, phone, password })
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
        <h1 className={styles.title}>Регистрация</h1>

        <div className={styles.card}>
          {error && <p className={styles.error}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="email"
              placeholder="Электронная почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              className={styles.input}
              type="tel"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? 'Registration…' : 'Register'}
            </button>
          </form>

          <div className={styles.divider}>or</div>

          <button type="button" className={`${styles.socialBtn} ${styles.apple}`}>
            <span className={styles.socialIcon}></span>
            Continue with Apple
          </button>
          <GoogleSignInButton onSuccess={onSuccess} />
        </div>

        <p className={styles.legal}>
          By continuing, you agree to{' '}
          <a href="#">User agreement</a>,{' '}
          <a href="#">Privacy Policy</a> и{' '}
          <a href="#">Site Rules</a>.
        </p>
        <p className={styles.legal}>
          <a href="#">If you are a company — go here</a>
        </p>

        <div className={styles.secondaryCard}>
          <button type="button" className={styles.secondaryBtn} onClick={onLogin}>
            Already have an account? Log in
          </button>
        </div>
      </div>
    </main>
  )
}

export default Register
