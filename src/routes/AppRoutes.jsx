import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Unauthorized from "../pages/Unauthorized"

import UserLayout from "../layouts/UserLayout"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"

import UserDashboard from "../pages/user/UserDashboard"
import CoachDashboard from "../pages/coach/CoachDashboard"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UserManagement from "../pages/admin/UserManagement"

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
        </Route>

        <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
        </Route>

        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="usuarios" element={<UserManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes