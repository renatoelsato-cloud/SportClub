const API_URL = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function getMyReservations() {
  const response = await fetch(`${API_URL}/reservations/my-reservations`, {
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener reservas")
  return data
}

export async function getAvailableClasses() {
  const response = await fetch(`${API_URL}/member/classes`, {
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al obtener clases")
  return data
}

export async function createReservation(classScheduleId) {
  const response = await fetch(`${API_URL}/reservations`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ class_schedule_id: classScheduleId }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al crear reserva")
  return data
}

export async function cancelReservation(id) {
  const response = await fetch(`${API_URL}/reservations/${id}/cancel`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error al cancelar reserva")
  return data
}