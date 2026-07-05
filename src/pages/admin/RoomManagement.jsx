import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Modal, Row, Spinner, Table, Alert } from "react-bootstrap"
import Swal from "sweetalert2"
import { getRooms, createRoom, updateRoom, deleteRoom } from "../../services/roomService"

const emptyForm = { name: "", description: "", capacity: "", location: "", observation: "", status: true }

function RoomManagement() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchRooms = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getRooms()
      setRooms(data.data || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRooms() }, [])

  const handleOpenCreate = () => {
    setModalMode("create")
    setFormData(emptyForm)
    setFormError("")
    setSelectedRoom(null)
    setShowModal(true)
  }

  const handleOpenEdit = (room) => {
    setModalMode("edit")
    setSelectedRoom(room)
    setFormData({ name: room.name || "", description: room.description || "", capacity: room.capacity || "", location: room.location || "", observation: room.observation || "", status: room.status })
    setFormError("")
    setShowModal(true)
  }

  const handleChange = (e) => {
    const value = e.target.name === "status" ? e.target.value === "true" : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSave = async () => {
    setFormError("")
    if (!formData.name || !formData.capacity) {
      setFormError("Nombre y capacidad son obligatorios.")
      return
    }
    setSaving(true)
    try {
      if (modalMode === "create") {
        await createRoom(formData)
        Swal.fire({ icon: "success", title: "Sala creada", confirmButtonColor: "#6f0000" })
      } else {
        await updateRoom(selectedRoom.id, formData)
        Swal.fire({ icon: "success", title: "Sala actualizada", confirmButtonColor: "#6f0000" })
      }
      setShowModal(false)
      fetchRooms()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: "¿Eliminar sala?",
      text: `Se eliminará ${room.name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6f0000",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      try {
        await deleteRoom(room.id)
        Swal.fire({ icon: "success", title: "Eliminada", confirmButtonColor: "#6f0000" })
        fetchRooms()
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#6f0000" })
      }
    }
  }

  return (
    <Container>
      <Row className="align-items-center mb-4">
        <Col><h3 className="mb-0">🏢 Gestión de Salas</h3></Col>
        <Col className="text-end">
          <Button style={{ backgroundColor: "#6f0000", border: "none" }} onClick={handleOpenCreate}>
            + Nueva Sala
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
              <th>Capacidad</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-muted">No hay salas registradas.</td></tr>
            ) : (
              rooms.map((room, index) => (
                <tr key={room.id}>
                  <td>{index + 1}</td>
                  <td>{room.name}</td>
                  <td>{room.capacity}</td>
                  <td>{room.location}</td>
                  <td><span className={`badge ${room.status ? "bg-success" : "bg-secondary"}`}>{room.status ? "Activa" : "Inactiva"}</span></td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleOpenEdit(room)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(room)}>Eliminar</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#6f0000", color: "white" }}>
          <Modal.Title>{modalMode === "create" ? "Crear Sala" : "Editar Sala"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre de la sala" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="20" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ubicación" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observación</Form.Label>
              <Form.Control type="text" name="observation" value={formData.observation} onChange={handleChange} placeholder="Observaciones" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button style={{ backgroundColor: "#6f0000", border: "none" }} onClick={handleSave} disabled={saving}>
            {saving ? <><Spinner size="sm" animation="border" /> Guardando...</> : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default RoomManagement 