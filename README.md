# SportClub - Aplicación Web SPA

## Descripción
Aplicación SPA desarrollada con React, React Router y React-Bootstrap que incluye autenticación, control de acceso por roles y módulo CRUD de administración.

## Integrantes
- [Tu nombre aquí]

## Tecnologías utilizadas
- React + Vite
- React Router DOM
- React-Bootstrap + Bootstrap
- SweetAlert2
- LocalStorage para persistencia de sesión

## Instalación de dependencias
npm install

## Cómo ejecutar el frontend
npm run dev

## Cómo ejecutar el backend
cd backend
npm install
npm start

## Estructura del proyecto
src/
├── components/
├── layouts/
│   ├── AdminLayout.jsx
│   ├── CoachLayout.jsx
│   └── UserLayout.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Unauthorized.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── UserManagement.jsx
│   ├── coach/
│   │   └── CoachDashboard.jsx
│   └── user/
│       └── UserDashboard.jsx
├── routes/
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   └── RoleRoute.jsx
├── services/
│   ├── authService.js
│   └── userService.js
├── App.jsx
└── main.jsx 