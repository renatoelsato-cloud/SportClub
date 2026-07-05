import { useEffect, useState } from "react"
import { Container, Table, Spinner, Alert, Button, Badge } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMyReservations, cancelReservation } from "../../services/reservationService"

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchReservations = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getMyReservations()
      setReservations(data.data || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReservations() }, [])

  const handleCancel = async (reservation) => {
    const result = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
    })
    if (result.isConfirmed) {
      try {
        await cancelReservation(reservation.id)
        Swal.fire({ icon: "success", title: "Reserva cancelada", confirmButtonColor: "#003580" })
        fetchReservations()
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#003580" })
      }
    }
  }

  return (
    <Container>
      <h3 className="mb-4">📅 Mis Reservas</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: "#003580" }} />
        </div>
      ) : reservations.length === 0 ? (
        <Alert variant="info">No tienes reservas activas.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#003580", color: "white" }}>
            <tr>
              <th>#</th>
              <th>Deporte</th>
              <th>Sala</th>
              <th>Día</th>
              <th>Horario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res, index) => (
              <tr key={res.id}>
                <td>{index + 1}</td>
                <td>{res.ClassSchedule?.SportRoom?.Sport?.name || "-"}</td>
                <td>{res.ClassSchedule?.SportRoom?.Room?.name || "-"}</td>
                <td>{days[res.ClassSchedule?.day_of_week] || "-"}</td>
                <td>{res.ClassSchedule?.start_time} - {res.ClassSchedule?.end_time}</td>
                <td>
                  <Badge bg={res.status === "active" ? "success" : "secondary"}>
                    {res.status === "active" ? "Activa" : res.status}
                  </Badge>
                </td>
                <td>
                  {res.status === "active" && (
                    <Button size="sm" variant="danger" onClick={() => handleCancel(res)}>
                      Cancelar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default MyReservations 
