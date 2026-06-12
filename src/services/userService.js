const API_URL = "http://localhost:3000/api"

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener usuarios")
  return data
}

export async function createUser(userData) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear usuario")
  return data
}

export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al actualizar usuario")
  return data
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al eliminar usuario")
  return data
} 