import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"
import { registerUser } from "../services/authService"

function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos.")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setLoading(true)
    try {
      await registerUser({ full_name: fullName, email, password })
      navigate("/login")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "26rem" }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4 fs-3 fw-bold">
            🏋️ SportClub
          </Card.Title>
          <Card.Subtitle className="text-center text-muted mb-4">
            Crear Cuenta
          </Card.Subtitle>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repita su contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="success" className="w-100 mb-3" disabled={loading}>
              {loading ? (
                <><Spinner size="sm" animation="border" /> Registrando...</>
              ) : (
                "Registrarse"
              )}
            </Button>
          </Form>

          <div className="text-center">
            <small>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Register