const API_URL = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function getSportRooms() {
  const response = await fetch(`${API_URL}/sport-rooms`, {
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener asignaciones")
  return data
}

export async function createSportRoom(data) {
  const response = await fetch(`${API_URL}/sport-rooms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || "Error al crear asignación")
  return result
}

export async function updateSportRoom(id, data) {
  const response = await fetch(`${API_URL}/sport-rooms/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || "Error al actualizar asignación")
  return result
}

export async function deleteSportRoom(id) {
  const response = await fetch(`${API_URL}/sport-rooms/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || "Error al eliminar asignación")
  return result
}