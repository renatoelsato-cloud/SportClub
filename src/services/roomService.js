const API_URL = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function getRooms() {
  const response = await fetch(`${API_URL}/rooms`, {
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener salas")
  return data
}

export async function createRoom(roomData) {
  const response = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear sala")
  return data
}

export async function updateRoom(id, roomData) {
  const response = await fetch(`${API_URL}/rooms/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al actualizar sala")
  return data
}

export async function deleteRoom(id) {
  const response = await fetch(`${API_URL}/rooms/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al eliminar sala")
  return data
}