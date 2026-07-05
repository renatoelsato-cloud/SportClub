import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Modal, Row, Spinner, Table, Alert } from "react-bootstrap"
import Swal from "sweetalert2"
import { getSportRooms, createSportRoom, updateSportRoom, deleteSportRoom } from "../../services/sportRoomService"
import { getSports } from "../../services/sportService"
import { getRooms } from "../../services/roomService"
import { getUsers } from "../../services/userService"

const emptyForm = { sport_id: "", room_id: "", coach_id: "", observation: "", status: true }

function SportRoomManagement() {
  const [sportRooms, setSportRooms] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [srData, sData, rData, uData] = await Promise.all([
        getSportRooms(), getSports(), getRooms(), getUsers()
      ])
      setSportRooms(srData.data || srData)
      setSports(sData.data || sData)
      setRooms(rData.data || rData)
      const allUsers = uData.data || uData
      setCoaches(allUsers.filter(u => u.role === "coach"))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleOpenCreate = () => {
    setModalMode("create")
    setFormData(emptyForm)
    setFormError("")
    setSelectedItem(null)
    setShowModal(true)
  }

  const handleOpenEdit = (item) => {
    setModalMode("edit")
    setSelectedItem(item)
    setFormData({ sport_id: item.sport_id || "", room_id: item.room_id || "", coach_id: item.coach_id || "", observation: item.observation || "", status: item.status })
    setFormError("")
    setShowModal(true)
  }

  const handleChange = (e) => {
    const value = e.target.name === "status" ? e.target.value === "true" : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSave = async () => {
    setFormError("")
    if (!formData.sport_id || !formData.room_id || !formData.coach_id) {
      setFormError("Deporte, sala y coach son obligatorios.")
      return
    }
    setSaving(true)
    try {
      if (modalMode === "create") {
        await createSportRoom(formData)
        Swal.fire({ icon: "success", title: "Asignación creada", confirmButtonColor: "#6f0000" })
      } else {
        await updateSportRoom(selectedItem.id, formData)
        Swal.fire({ icon: "success", title: "Asignación actualizada", confirmButtonColor: "#6f0000" })
      }
      setShowModal(false)
      fetchAll()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "¿Eliminar asignación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6f0000",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      try {
        await deleteSportRoom(item.id)
        Swal.fire({ icon: "success", title: "Eliminada", confirmButtonColor: "#6f0000" })
        fetchAll()
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#6f0000" })
      }
    }
  }

  return (
    <Container>
      <Row className="align-items-center mb-4">
        <Col><h3 className="mb-0">🔗 Gestión de Asignaciones</h3></Col>
        <Col className="text-end">
          <Button style={{ backgroundColor: "#6f0000", border: "none" }} onClick={handleOpenCreate}>+ Nueva Asignación</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" style={{ color: "#6f0000" }} /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#6f0000", color: "white" }}>
            <tr><th>#</th><th>Deporte</th><th>Sala</th><th>Coach</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {sportRooms.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-muted">No hay asignaciones.</td></tr>
            ) : (
              sportRooms.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.Sport?.name || item.sport_id}</td>
                  <td>{item.Room?.name || item.room_id}</td>
                  <td>{item.Coach?.full_name || item.coach_id}</td>
                  <td><span className={`badge ${item.status ? "bg-success" : "bg-secondary"}`}>{item.status ? "Activo" : "Inactivo"}</span></td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleOpenEdit(item)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>Eliminar</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#6f0000", color: "white" }}>
          <Modal.Title>{modalMode === "create" ? "Crear Asignación" : "Editar Asignación"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Deporte</Form.Label>
              <Form.Select name="sport_id" value={formData.sport_id} onChange={handleChange}>
                <option value="">Seleccionar deporte</option>
                {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sala</Form.Label>
              <Form.Select name="room_id" value={formData.room_id} onChange={handleChange}>
                <option value="">Seleccionar sala</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Coach</Form.Label>
              <Form.Select name="coach_id" value={formData.coach_id} onChange={handleChange}>
                <option value="">Seleccionar coach</option>
                {coaches.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observación</Form.Label>
              <Form.Control type="text" name="observation" value={formData.observation} onChange={handleChange} placeholder="Observación" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
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

export default SportRoomManagement 