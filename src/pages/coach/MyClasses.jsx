import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Badge, Spinner, Alert } from "react-bootstrap"

function MyClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_URL = import.meta.env.VITE_API_URL

  const fetchClasses = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/coach/my-classes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Error al obtener clases")
      setClasses(data.data || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClasses() }, [])

  return (
    <Container>
      <h3 className="mb-4">📋 Mis Clases</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: "#1a5c2a" }} />
        </div>
      ) : classes.length === 0 ? (
        <Alert variant="info">No tienes clases asignadas.</Alert>
      ) : (
        <Row className="g-4">
          {classes.map((clase) => (
            <Col md={4} key={clase.id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{clase.Sport?.name || clase.sport_name || "Deporte"}</Card.Title>
                  <Card.Text className="text-muted">
                    <strong>Sala:</strong> {clase.Room?.name || clase.room_name || "Sin sala"}<br />
                    <strong>Día:</strong> {["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"][clase.day_of_week] || clase.day_of_week}<br />
                    <strong>Horario:</strong> {clase.start_time} - {clase.end_time}
                  </Card.Text>
                  <Badge bg={clase.status ? "success" : "secondary"}>
                    {clase.status ? "Activa" : "Inactiva"}
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default MyClasses 