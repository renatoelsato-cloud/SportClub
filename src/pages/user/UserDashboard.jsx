import { Card, Col, Container, Row, Button } from "react-bootstrap"
import { getUser } from "../../services/authService"

function UserDashboard() {
  const user = getUser()

  return (
    <Container>
      <h2 className="mb-1">Mi Panel</h2>
      <p className="text-muted mb-4">
        Bienvenido, <strong>{user?.full_name || user?.name}</strong>
      </p>

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center py-4">
              <div className="fs-1 mb-2">📅</div>
              <Card.Title>Mis Reservas</Card.Title>
              <Card.Text className="text-muted">
                Revisa y gestiona tus reservas de clases.
              </Card.Text>
              <Button style={{ backgroundColor: "#003580", border: "none" }}>
                Ver Reservas
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center py-4">
              <div className="fs-1 mb-2">🏃</div>
              <Card.Title>Clases Disponibles</Card.Title>
              <Card.Text className="text-muted">
                Explora las clases disponibles para ti.
              </Card.Text>
              <Button style={{ backgroundColor: "#003580", border: "none" }}>
                Ver Clases
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center py-4">
              <div className="fs-1 mb-2">👤</div>
              <Card.Title>Mi Perfil</Card.Title>
              <Card.Text className="text-muted">
                Actualiza tu información personal.
              </Card.Text>
              <Button style={{ backgroundColor: "#003580", border: "none" }}>
                Ver Perfil
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default UserDashboard
