import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Modal, Row, Spinner, Table, Alert } from "react-bootstrap"
import Swal from "sweetalert2"
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userService"

const emptyForm = { full_name: "", email: "", password: "", role: "user" }

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getUsers()
      setUsers(data.data || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleOpenCreate = () => {
    setModalMode("create")
    setFormData(emptyForm)
    setFormError("")
    setSelectedUser(null)
    setShowModal(true)
  }

  const handleOpenEdit = (user) => {
    setModalMode("edit")
    setSelectedUser(user)
    setFormData({
      full_name: user.full_name || user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
    })
    setFormError("")
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormError("")
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setFormError("")
    if (!formData.full_name || !formData.email || !formData.role) {
      setFormError("Nombre, correo y rol son obligatorios.")
      return
    }
    if (modalMode === "create" && !formData.password) {
      setFormError("La contraseña es obligatoria al crear un usuario.")
      return
    }
    setSaving(true)
    try {
      if (modalMode === "create") {
        await createUser(formData)
        Swal.fire({ icon: "success", title: "Usuario creado", text: "El usuario fue creado exitosamente.", confirmButtonColor: "#6f0000" })
      } else {
        const payload = { ...formData }
        if (!payload.password) delete payload.password
        await updateUser(selectedUser.id, payload)
        Swal.fire({ icon: "success", title: "Usuario actualizado", text: "Los datos fueron actualizados correctamente.", confirmButtonColor: "#6f0000" })
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${user.full_name || user.name}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6f0000",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      try {
        await deleteUser(user.id)
        Swal.fire({ icon: "success", title: "Eliminado", text: "El usuario fue eliminado correctamente.", confirmButtonColor: "#6f0000" })
        fetchUsers()
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#6f0000" })
      }
    }
  }

  return (
    <Container>
      <Row className="align-items-center mb-4">
        <Col>
          <h3 className="mb-0">👥 Gestión de Usuarios</h3>
        </Col>
        <Col className="text-end">
          <Button style={{ backgroundColor: "#6f0000", border: "none" }} onClick={handleOpenCreate}>
            + Nuevo Usuario
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: "#6f0000" }} />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#6f0000", color: "white" }}>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">No hay usuarios registrados.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.full_name || user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === "admin" ? "bg-danger" : user.role === "coach" ? "bg-success" : "bg-primary"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleOpenEdit(user)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(user)}>Eliminar</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#6f0000", color: "white" }}>
          <Modal.Title>{modalMode === "create" ? "Crear Usuario" : "Editar Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control type="text" name="full_name" placeholder="Nombre completo" value={formData.full_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" name="email" placeholder="correo@ejemplo.cl" value={formData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña {modalMode === "edit" && <small className="text-muted">(dejar vacío para no cambiar)</small>}</Form.Label>
              <Form.Control type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">Usuario</option>
                <option value="coach">Coach</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button style={{ backgroundColor: "#6f0000", border: "none" }} onClick={handleSave} disabled={saving}>
            {saving ? <><Spinner size="sm" animation="border" /> Guardando...</> : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default UserManagement 