# TecTest Lubee - Frontend (React)

App básica con login y vista de inmuebles usando React + Vite + Bootstrap.

## Scripts

- `npm install` para instalar dependencias.
- `npm run dev` para desarrollo (http://localhost:5173).
- `npm run build` y `npm run preview` para compilar y previsualizar.

## Configuración

- API base configurable con `VITE_API_URL` (por defecto `http://localhost:5054/api`).
- Importa Bootstrap desde `bootstrap/dist/css/bootstrap.min.css`.

## Flujo

1. Login en `/` con credenciales válidas de la API (`POST /api/auth/login`).
2. Si el login es exitoso, redirige a `/inmuebles` y muestra tabla con datos de `GET /api/inmueble`.
3. Token y usuario se guardan en `localStorage` (`ttl-token`, `ttl-user`) hasta cerrar sesión.
