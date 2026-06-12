import { Link, Outlet, useNavigate } from "react-router-dom"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { logout, getUser } from "../services/authService"

function CoachLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <>
      <Navbar style={{ backgroundColor: "#1a5c2a" }} variant="dark" expand="lg">
        <Container>
          <Navbar.Brand className="fw-bold fs-4">
            🏋️ SportClub <span style={{ color: "#55efc4", fontSize: "0.7em" }}>Coach</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="coach-nav" />
          <Navbar.Collapse id="coach-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/coach/dashboard">🏠 Inicio</Nav.Link>
            </Nav>
            <Nav className="ms-auto align-items-center">
              <NavDropdown
                title={`👤 ${user?.full_name || user?.name || "Coach"}`}
                id="coach-dropdown"
                menuVariant="dark"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/coach/dashboard">Mi Perfil</NavDropdown.Item>
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

export default CoachLayout 