import { Link, Outlet, useNavigate } from "react-router-dom"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { logout, getUser } from "../services/authService"

function UserLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <>
      <Navbar style={{ backgroundColor: "#003580" }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand className="fw-bold fs-4">
            🏋️ SportClub <span style={{ color: "#74b9ff", fontSize: "0.7em" }}>Usuario</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="user-nav" />
          <Navbar.Collapse id="user-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/user/dashboard">🏠 Inicio</Nav.Link>
              <Nav.Link as={Link} to="/user/clases">🏃 Clases Disponibles</Nav.Link>
              <Nav.Link as={Link} to="/user/reservas">📅 Mis Reservas</Nav.Link>
            </Nav>
            <Nav className="ms-auto align-items-center">
              <NavDropdown
                title={`👤 ${user?.full_name || user?.name || "Usuario"}`}
                id="user-dropdown"
                menuVariant="dark"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/user/perfil">Mi Perfil</NavDropdown.Item>
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

export default UserLayout 