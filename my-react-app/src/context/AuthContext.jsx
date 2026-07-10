import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'
import {
  clearSession,
  getSessionUser,
  loginUser,
  registerUser,
} from '../utils/auth'

const AuthContext = createContext(null)

function mapFirebaseUser(fbUser) {
  return {
    id: fbUser.uid,
    email: fbUser.email ?? '',
    displayName: fbUser.displayName ?? '',
    photoURL: fbUser.photoURL ?? '',
    provider: 'google',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(getSessionUser())
      setReady(true)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser(mapFirebaseUser(fbUser))
      } else {
        setUser(getSessionUser())
      }
      setReady(true)
    })

    return unsubscribe
  }, [])

  const register = useCallback(async ({ email, phone, password }) => {
    if (auth?.currentUser) {
      await signOut(auth)
    }
    const newUser = registerUser({ email, phone, password })
    setUser(newUser)
    return newUser
  }, [])

  const login = useCallback(async ({ identifier, password }) => {
    if (auth?.currentUser) {
      await signOut(auth)
    }
    const loggedIn = loginUser({ identifier, password })
    setUser(loggedIn)
    return loggedIn
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase не настроен. Создайте файл .env по образцу .env.example',
      )
    }

    clearSession()
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return mapFirebaseUser(result.user)
  }, [])

  const logout = useCallback(async () => {
    clearSession()
    if (auth?.currentUser) {
      await signOut(auth)
    } else {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        register,
        login,
        loginWithGoogle,
        logout,
        isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
