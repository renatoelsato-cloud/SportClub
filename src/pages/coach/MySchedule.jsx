import { useEffect, useState } from "react"
import { Container, Table, Spinner, Alert, Badge } from "react-bootstrap"

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function MySchedule() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_URL = import.meta.env.VITE_API_URL

  const fetchSchedules = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/coach/my-schedules`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Error al obtener horarios")
      setSchedules(data.data || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSchedules() }, [])

  return (
    <Container>
      <h3 className="mb-4">📆 Mi Horario</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: "#1a5c2a" }} />
        </div>
      ) : schedules.length === 0 ? (
        <Alert variant="info">No tienes horarios asignados.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#1a5c2a", color: "white" }}>
            <tr>
              <th>#</th>
              <th>Deporte</th>
              <th>Sala</th>
              <th>Día</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.Sport?.name || item.sport_name || "-"}</td>
                <td>{item.Room?.name || item.room_name || "-"}</td>
                <td>{days[item.day_of_week] || item.day_of_week}</td>
                <td>{item.start_time}</td>
                <td>{item.end_time}</td>
                <td>
                  <Badge bg={item.status ? "success" : "secondary"}>
                    {item.status ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default MySchedule 