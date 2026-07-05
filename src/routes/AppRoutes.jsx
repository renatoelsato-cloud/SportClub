import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Unauthorized from "../pages/Unauthorized"
import Profile from "../pages/Profile"

import UserLayout from "../layouts/UserLayout"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"

import UserDashboard from "../pages/user/UserDashboard"
import CoachDashboard from "../pages/coach/CoachDashboard"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UserManagement from "../pages/admin/UserManagement"
import SportManagement from "../pages/admin/SportManagement"
import RoomManagement from "../pages/admin/RoomManagement"
import SportRoomManagement from "../pages/admin/SportRoomManagement"
import ScheduleManagement from "../pages/admin/ScheduleManagement"
import MyClasses from "../pages/coach/MyClasses"
import MySchedule from "../pages/coach/MySchedule"
import AvailableClasses from "../pages/user/AvailableClasses"
import MyReservations from "../pages/user/MyReservations"

import ProtectedRoute from "./ProtectedRoute"
import RoleRoute from "./RoleRoute"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/user" element={<RoleRoute allowedRoles={["user"]}><UserLayout /></RoleRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="clases" element={<AvailableClasses />} />
          <Route path="reservas" element={<MyReservations />} />
          <Route path="perfil" element={<Profile />} />
        </Route>

        <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="mis-clases" element={<MyClasses />} />
          <Route path="mi-horario" element={<MySchedule />} />
          <Route path="perfil" element={<Profile />} />
        </Route>

        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="usuarios" element={<UserManagement />} />
          <Route path="deportes" element={<SportManagement />} />
          <Route path="salas" element={<RoomManagement />} />
          <Route path="asignaciones" element={<SportRoomManagement />} />
          <Route path="horarios" element={<ScheduleManagement />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes 