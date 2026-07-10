const USERS_KEY = 'drive2_users'
const SESSION_KEY = 'drive2_session'

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSessionUser() {
  const id = localStorage.getItem(SESSION_KEY)
  if (!id) return null
  return getUsers().find((u) => u.id === id) ?? null
}

export function setSession(userId) {
  localStorage.setItem(SESSION_KEY, userId)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function registerUser({ email, phone, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedPhone = phone.trim()
  const users = getUsers()

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error('Этот email уже зарегистрирован')
  }
  if (users.some((u) => u.phone === normalizedPhone)) {
    throw new Error('Этот телефон уже зарегистрирован')
  }

  const user = {
    id: String(Date.now()),
    email: normalizedEmail,
    phone: normalizedPhone,
    password,
  }

  users.push(user)
  saveUsers(users)
  setSession(user.id)
  return user
}

export function loginUser({ identifier, password }) {
  const value = identifier.trim()
  const emailTry = value.toLowerCase()
  const user = getUsers().find(
    (u) => u.email === emailTry || u.phone === value,
  )

  if (!user || user.password !== password) {
    throw new Error('Неверный телефон, email или пароль')
  }

  setSession(user.id)
  return user
}
