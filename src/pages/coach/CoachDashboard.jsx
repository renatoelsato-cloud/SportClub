import { Card, Col, Container, Row, Button } from "react-bootstrap"
import { getUser } from "../../services/authService"

function CoachDashboard() {
  const user = getUser()

  return (
    <Container>
      <h2 className="mb-1">Panel del Coach</h2>
      <p className="text-muted mb-4">
        Bienvenido, <strong>{user?.full_name || user?.name}</strong>
      </p>

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center py-4">
              <div className="fs-1 mb-2">👨‍🎓</div>
              <Card.Title>Mis Alumnos</Card.Title>
              <Card.Text className="text-muted">
                Revisa y gestiona tus alumnos asignados.
              </Card.Text>
              <Button style={{ backgroundColor: "#1a5c2a", border: "none" }}>
                Ver Alumnos
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center py-4">
              <div className="fs-1 mb-2">📋</div>
              <Card.Title>Mis Clases</Card.Title>
              <Card.Text className="text-muted">
                Administra las clases que impartes.
              </Card.Text>
              <Button style={{ backgroundColor: "#1a5c2a", border: "none" }}>
                Ver Clases
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center py-4">
              <div className="fs-1 mb-2">📆</div>
              <Card.Title>Mi Horario</Card.Title>
              <Card.Text className="text-muted">
                Consulta tu horario semanal de clases.
              </Card.Text>
              <Button style={{ backgroundColor: "#1a5c2a", border: "none" }}>
                Ver Horario
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CoachDashboard