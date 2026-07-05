import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Modal, Row, Spinner, Table, Alert } from "react-bootstrap"
import Swal from "sweetalert2"
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from "../../services/scheduleService"
import { getSportRooms } from "../../services/sportRoomService"

const emptyForm = { sport_room_id: "", day_of_week: "", start_time: "", end_time: "", status: true }

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

function ScheduleManagement() {
  const [schedules, setSchedules] = useState([])
  const [sportRooms, setSportRooms] = useState([])
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
      const [schData, srData] = await Promise.all([getSchedules(), getSportRooms()])
      setSchedules(schData.data || schData)
      setSportRooms(srData.data || srData)
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
    setFormData({ sport_room_id: item.sport_room_id || "", day_of_week: item.day_of_week ?? "", start_time: item.start_time || "", end_time: item.end_time || "", status: item.status })
    setFormError("")
    setShowModal(true)
  }

  const handleChange = (e) => {
    const value = e.target.name === "status" ? e.target.value === "true" : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSave = async () => {
    setFormError("")
    if (!formData.sport_room_id || formData.day_of_week === "" || !formData.start_time || !formData.end_time) {
      setFormError("Todos los campos son obligatorios.")
      return
    }
    setSaving(true)
    try {
      if (modalMode === "create") {
        await createSchedule(formData)
        Swal.fire({ icon: "success", title: "Horario creado", confirmButtonColor: "#6f0000" })
      } else {
        await updateSchedule(selectedItem.id, formData)
        Swal.fire({ icon: "success", title: "Horario actualizado", confirmButtonColor: "#6f0000" })
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
      title: "¿Eliminar horario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6f0000",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      try {
        await deleteSchedule(item.id)
        Swal.fire({ icon: "success", title: "Eliminado", confirmButtonColor: "#6f0000" })
        fetchAll()
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#6f0000" })
      }
    }
  }

  return (
    <Container>
      <Row className="align-items-center mb-4">
        <Col><h3 className="mb-0">📅 Gestión de Horarios</h3></Col>
        <Col className="text-end">
          <Button style={{ backgroundColor: "#6f0000", border: "none" }} onClick={handleOpenCreate}>+ Nuevo Horario</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" style={{ color: "#6f0000" }} /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#6f0000", color: "white" }}>
            <tr><th>#</th><th>Asignación</th><th>Día</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-muted">No hay horarios.</td></tr>
            ) : (
              schedules.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.sport_room_id}</td>
                  <td>{days[item.day_of_week]}</td>
                  <td>{item.start_time}</td>
                  <td>{item.end_time}</td>
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
          <Modal.Title>{modalMode === "create" ? "Crear Horario" : "Editar Horario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Asignación</Form.Label>
              <Form.Select name="sport_room_id" value={formData.sport_room_id} onChange={handleChange}>
                <option value="">Seleccionar asignación</option>
                {sportRooms.map(sr => <option key={sr.id} value={sr.id}>ID {sr.id} - {sr.Sport?.name || sr.sport_id}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Día</Form.Label>
              <Form.Select name="day_of_week" value={formData.day_of_week} onChange={handleChange}>
                <option value="">Seleccionar día</option>
                {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora inicio</Form.Label>
              <Form.Control type="time" name="start_time" value={formData.start_time} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora fin</Form.Label>
              <Form.Control type="time" name="end_time" value={formData.end_time} onChange={handleChange} />
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

export default ScheduleManagement