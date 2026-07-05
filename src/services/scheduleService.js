const API_URL = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function getSchedules() {
  const response = await fetch(`${API_URL}/class-schedules`, {
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener horarios")
  return data
}

export async function createSchedule(scheduleData) {
  const response = await fetch(`${API_URL}/class-schedules`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(scheduleData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear horario")
  return data
}

export async function updateSchedule(id, scheduleData) {
  const response = await fetch(`${API_URL}/class-schedules/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(scheduleData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al actualizar horario")
  return data
}

export async function deleteSchedule(id) {
  const response = await fetch(`${API_URL}/class-schedules/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al eliminar horario")
  return data
}