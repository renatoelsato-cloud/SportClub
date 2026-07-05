import { Link, Outlet, useNavigate } from "react-router-dom"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { logout, getUser } from "../services/authService"

function AdminLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <>
      <Navbar style={{ backgroundColor: "#6f0000" }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand className="fw-bold fs-4">
            🏋️ SportClub <span style={{ color: "#ff6b6b", fontSize: "0.7em" }}>Admin</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-nav" />
          <Navbar.Collapse id="admin-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin/dashboard">📊 Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/admin/usuarios">👥 Usuarios</Nav.Link>
              <Nav.Link as={Link} to="/admin/deportes">🏅 Deportes</Nav.Link>
              <Nav.Link as={Link} to="/admin/salas">🏢 Salas</Nav.Link>
              <Nav.Link as={Link} to="/admin/asignaciones">🔗 Asignaciones</Nav.Link>
              <Nav.Link as={Link} to="/admin/horarios">📅 Horarios</Nav.Link>
            </Nav>
            <Nav className="ms-auto align-items-center">
              <NavDropdown
                title={`👤 ${user?.full_name || user?.name || "Administrador"}`}
                id="admin-dropdown"
                menuVariant="dark"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/admin/perfil">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  )
}

export default AdminLayout 