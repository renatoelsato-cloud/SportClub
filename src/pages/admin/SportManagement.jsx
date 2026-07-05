import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Modal, Row, Spinner, Table, Alert } from "react-bootstrap"
import Swal from "sweetalert2"
import { getSports, createSport, updateSport, deleteSport } from "../../services/sportService"

const emptyForm = { name: "", objective: "", duration: "", status: true }

function SportManagement() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [selectedSport, setSelectedSport] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchSports = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getSports()
      setSports(data.data || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSports() }, [])

  const handleOpenCreate = () => {
    setModalMode("create")
    setFormData(emptyForm)
    setFormError("")
    setSelectedSport(null)
    setShowModal(true)
  }

  const handleOpenEdit = (sport) => {
    setModalMode("edit")
    setSelectedSport(sport)
    setFormData({ name: sport.name || "", objective: sport.objective || "", duration: sport.duration || "", status: sport.status })
    setFormError("")
    setShowModal(true)
  }

  const handleChange = (e) => {
    const value = e.target.name === "status" ? e.target.value === "true" : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSave = async () => {
    setFormError("")
    if (!formData.name || !formData.duration) {
      setFormError("Nombre y duración son obligatorios.")
      return
    }
    setSaving(true)
    try {
      if (modalMode === "create") {
        await createSport(formData)
        Swal.fire({ icon: "success", title: "Deporte creado", confirmButtonColor: "#6f0000" })
      } else {
        await updateSport(selectedSport.id, formData)
        Swal.fire({ icon: "success", title: "Deporte actualizado", confirmButtonColor: "#6f0000" })
      }
      setShowModal(false)
      fetchSports()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: "¿Eliminar deporte?",
      text: `Se eliminará ${sport.name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6f0000",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (result.isConfirmed) {
      try {
        await deleteSport(sport.id)
        Swal.fire({ icon: "success", title: "Eliminado", confirmButtonColor: "#6f0000" })
        fetchSports()
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#6f0000" })
      }
    }
  }

  return (
    <Container>
      <Row className="align-items-center mb-4">
        <Col><h3 className="mb-0">🏅 Gestión de Deportes</h3></Col>
        <Col className="text-end">
          <Button style={{ backgroundColor: "#6f0000", border: "none" }} onClick={handleOpenCreate}>
            + Nuevo Deporte
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
              <th>Objetivo</th>
              <th>Duración (min)</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sports.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-muted">No hay deportes registrados.</td></tr>
            ) : (
              sports.map((sport, index) => (
                <tr key={sport.id}>
                  <td>{index + 1}</td>
                  <td>{sport.name}</td>
                  <td>{sport.objective}</td>
                  <td>{sport.duration}</td>
                  <td><span className={`badge ${sport.status ? "bg-success" : "bg-secondary"}`}>{sport.status ? "Activo" : "Inactivo"}</span></td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleOpenEdit(sport)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(sport)}>Eliminar</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#6f0000", color: "white" }}>
          <Modal.Title>{modalMode === "create" ? "Crear Deporte" : "Editar Deporte"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del deporte" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Objetivo</Form.Label>
              <Form.Control type="text" name="objective" value={formData.objective} onChange={handleChange} placeholder="Objetivo del deporte" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duración (minutos)</Form.Label>
              <Form.Control type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="60" />
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

export default SportManagement