import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from '../pages/auth.module.css'

function getGoogleErrorMessage(error) {
  if (error?.code === 'auth/popup-closed-by-user') {
    return ''
  }
  if (error?.code === 'auth/cancelled-popup-request') {
    return ''
  }
  return error?.message || 'Failed to sign in with Google'
}

function GoogleSignInButton({ onSuccess }) {
  const { loginWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClick = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      onSuccess?.()
    } catch (err) {
      const message = getGoogleErrorMessage(err)
      if (message) {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && <p className={styles.error}>{error}</p>}
      <button
        type="button"
        className={`${styles.socialBtn} ${styles.google}`}
        onClick={handleClick}
        disabled={loading}
      >
        <span className={`${styles.socialIcon} ${styles.googleIcon}`}>G</span>
        {loading ? 'Connection...' : 'Continue with Google'}
      </button>
    </>
  )
}

export default GoogleSignInButton
