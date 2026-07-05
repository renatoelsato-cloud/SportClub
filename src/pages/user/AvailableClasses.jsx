import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from "react-bootstrap"
import Swal from "sweetalert2"
import { getAvailableClasses, createReservation } from "../../services/reservationService"

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function AvailableClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchClasses = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getAvailableClasses()
      setClasses(data.data || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClasses() }, [])

  const handleReserve = async (clase) => {
    const result = await Swal.fire({
      title: "¿Reservar clase?",
      text: `${clase.Sport?.name || "Clase"} - ${days[clase.day_of_week]} ${clase.start_time}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#003580",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      try {
        await createReservation(clase.id)
        Swal.fire({ icon: "success", title: "¡Reserva creada!", confirmButtonColor: "#003580" })
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#003580" })
      }
    }
  }

  return (
    <Container>
      <h3 className="mb-4">🏃 Clases Disponibles</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: "#003580" }} />
        </div>
      ) : classes.length === 0 ? (
        <Alert variant="info">No hay clases disponibles.</Alert>
      ) : (
        <Row className="g-4">
          {classes.map((clase) => (
            <Col md={4} key={clase.id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{clase.Sport?.name || "Deporte"}</Card.Title>
                  <Card.Text className="text-muted">
                    <strong>Sala:</strong> {clase.Room?.name || "Sin sala"}<br />
                    <strong>Día:</strong> {days[clase.day_of_week]}<br />
                    <strong>Horario:</strong> {clase.start_time} - {clase.end_time}
                  </Card.Text>
                  <Badge bg={clase.status ? "success" : "secondary"} className="mb-2">
                    {clase.status ? "Disponible" : "No disponible"}
                  </Badge>
                  <br />
                  <Button
                    style={{ backgroundColor: "#003580", border: "none" }}
                    size="sm"
                    className="mt-2"
                    onClick={() => handleReserve(clase)}
                    disabled={!clase.status}
                  >
                    Reservar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default AvailableClasses 