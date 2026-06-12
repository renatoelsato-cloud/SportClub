import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"
import { loginUser, saveSession } from "../services/authService"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor completa todos los campos.")
      return
    }

    setLoading(true)
    try {
      const data = await loginUser({ email, password })
      saveSession(data.data.token, data.data.user)

      const role = data.data.user.role
      if (role === "admin") navigate("/admin/dashboard")
      else if (role === "coach") navigate("/coach/dashboard")
      else navigate("/user/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "24rem" }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4 fs-3 fw-bold">
            🏋️ SportClub
          </Card.Title>
          <Card.Subtitle className="text-center text-muted mb-4">
            Iniciar Sesión
          </Card.Subtitle>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
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
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
              {loading ? (
                <><Spinner size="sm" animation="border" /> Ingresando...</>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </Form>

          <div className="text-center">
            <small>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login 