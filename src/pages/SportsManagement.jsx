import React, { useEffect, useState } from 'react';
import { sportsService } from '../services/sportsService';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function SportsManagement() {
    const [sports, setSports] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        objective: '',
        duration: '',
        status: true
    });

    const fetchSports = async () => {
        try {
            const res = await sportsService.getAll();
            if (res.ok || res) {
                setSports(res.data || res);
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los deportes.', 'error');
        }
    };

    useEffect(() => {
        fetchSports();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.objective.trim() || !formData.duration) {
            Swal.fire('Advertencia', 'Todos los campos son obligatorios.', 'warning');
            return;
        }

        try {
            if (isEditing) {
                await sportsService.update(formData.id, formData);
                Swal.fire('¡Éxito!', 'Deporte actualizado correctamente.', 'success');
            } else {
                await sportsService.create(formData);
                Swal.fire('¡Éxito!', 'Deporte creado correctamente.', 'success');
            }
            setShowModal(false);
            fetchSports();
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al guardar el deporte.', 'error');
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: '¿Está seguro de eliminar este deporte?',
            text: "¡Esta acción no se puede revertir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await sportsService.delete(id);
                    Swal.fire('Eliminado', 'El deporte ha sido eliminado.', 'success');
                    fetchSports();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
                }
            }
        });
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await sportsService.changeStatus(id, !currentStatus);
            fetchSports();
        } catch (error) {
            Swal.fire('Error', 'No se pudo cambiar el estado.', 'error');
        }
    };

    const handleOpenCreate = () => {
        setIsEditing(false);
        setFormData({ id: null, name: '', objective: '', duration: '', status: true });
        setShowModal(true);
    };

    const handleOpenEdit = (sport) => {
        setIsEditing(true);
        setFormData({
            id: sport.id,
            name: sport.name,
            objective: sport.objective,
            duration: sport.duration,
            status: sport.status
        });
        setShowModal(true);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ color: '#6f42c1' }}>Modulo de Deportes</h2>
                <div>
                    <Button variant="outline-secondary" className="me-2" onClick={fetchSports}>
                        ?? Refrescar
                    </Button>
                    <Button variant="danger" onClick={handleOpenCreate}>
                        + Nuevo Deporte
                    </Button>
                </div>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Objetivo</th>
                        <th>Tiempo</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sports.map((sport) => (
                        <tr key={sport.id}>
                            <td>{sport.name}</td>
                            <td>{sport.objective}</td>
                            <td>{sport.duration} min</td>
                            <td>{formatDate(sport.created_at || sport.createdAt)}</td>
                            <td>
                                <Form.Check 
                                    type="switch"
                                    id={`switch-${sport.id}`}
                                    label={sport.status ? "Activo" : "Inactivo"}
                                    checked={sport.status}
                                    onChange={() => handleToggleStatus(sport.id, sport.status)}
                                />
                            </td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleOpenEdit(sport)}>
                                    Editar
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(sport.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Modificar Deporte' : 'Registrar Deporte'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                placeholder="Ej: Spinning"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Objetivo Técnico</Form.Label>
                            <Form.Control 
                                as="textarea" rows={3} 
                                value={formData.objective} 
                                onChange={(e) => setFormData({...formData, objective: e.target.value})} 
                                placeholder="Escriba el propósito..."
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duración Promedio (minutos)</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={formData.duration} 
                                onChange={(e) => setFormData({...formData, duration: e.target.value})} 
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                        <Button variant="danger" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
