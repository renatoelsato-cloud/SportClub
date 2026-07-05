import { useEffect, useState } from "react"
import { Container, Card, Form, Button, Spinner, Alert } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMyProfile, updateMyProfile } from "../services/profileService"

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ full_name: "", email: "" })

  const fetchProfile = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getMyProfile()
      const user = data.data || data
      setProfile(user)
      setFormData({ full_name: user.full_name || "", email: user.email || "" })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProfile() }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!formData.full_name || !formData.email) {
      Swal.fire({ icon: "warning", title: "Campos requeridos", text: "Nombre y correo son obligatorios." })
      return
    }
    setSaving(true)
    try {
      await updateMyProfile(profile.id, formData)
      Swal.fire({ icon: "success", title: "Perfil actualizado" })
      fetchProfile()
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>

  return (
    <Container className="mt-4">
      <Card className="shadow-sm" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Card.Header style={{ backgroundColor: "#6f0000", color: "white" }}>
          <h5 className="mb-0">👤 Mi Perfil</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Control type="text" value={profile?.role || ""} disabled />
            </Form.Group>
            <Button
              style={{ backgroundColor: "#6f0000", border: "none" }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <><Spinner size="sm" animation="border" /> Guardando...</> : "Guardar cambios"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Profile 