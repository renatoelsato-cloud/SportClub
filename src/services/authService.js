const API_URL = "http://localhost:3000/api/auth"

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al iniciar sesión")
  return data
}

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al registrar usuario")
  return data
}

export function saveSession(token, user) {
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem("token")
}

export function getUser() {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
} 