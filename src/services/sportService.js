const API_URL = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function getSports() {
  const response = await fetch(`${API_URL}/sports`, {
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener deportes")
  return data
}

export async function createSport(sportData) {
  const response = await fetch(`${API_URL}/sports`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(sportData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear deporte")
  return data
}

export async function updateSport(id, sportData) {
  const response = await fetch(`${API_URL}/sports/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(sportData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al actualizar deporte")
  return data
}

export async function deleteSport(id) {
  const response = await fetch(`${API_URL}/sports/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al eliminar deporte")
  return data
}