const API_URL = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function getMyProfile() {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener perfil")
  return data
}

export async function updateMyProfile(id, profileData) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al actualizar perfil")
  return data
} 