import { Link } from "react-router-dom"
import { Card, Col, Container, Row, Button } from "react-bootstrap"
import { getUser } from "../../services/authService"

function AdminDashboard() {
  const user = getUser()

  return (
    <Container>
      <h2 className="mb-1">Panel de Administración</h2>
      <p className="text-muted mb-4">
        Bienvenido, <strong>{user?.full_name || user?.name}</strong>
      </p>

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center py-4">
              <div className="fs-1 mb-2">👥</div>
              <Card.Title>Gestión de Usuarios</Card.Title>
              <Card.Text className="text-muted">
                Crear, editar y eliminar usuarios del sistema.
              </Card.Text>
              <Button
                as={Link}
                to="/admin/usuarios"
                style={{ backgroundColor: "#6f0000", border: "none" }}
              >
                Ver Usuarios
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center py-4">
              <div className="fs-1 mb-2">📊</div>
              <Card.Title>Estadísticas</Card.Title>
              <Card.Text className="text-muted">
                Resumen general del sistema.
              </Card.Text>
              <Button variant="outline-secondary" disabled>
                Próximamente
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center py-4">
              <div className="fs-1 mb-2">⚙️</div>
              <Card.Title>Configuración</Card.Title>
              <Card.Text className="text-muted">
                Ajustes generales del sistema.
              </Card.Text>
              <Button variant="outline-secondary" disabled>
                Próximamente
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard 