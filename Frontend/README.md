# TecTest Lubee - Frontend (React + Vite + Bootstrap)

UI para gestionar inmuebles y sus imágenes consumiendo la API .NET.

## Scripts

- `npm install` instala dependencias.
- `npm run dev` arranca Vite en http://localhost:5173.
- `npm run build` compila; `npm run preview` sirve el build.

## Configuración

- API base con `VITE_API_URL` (default `http://localhost:5054/api`).
- Fuentes e íconos: Manrope + Material Symbols (en `index.html`).
- Estilos base en `src/styles.css` y `src/theme.css`; Bootstrap importado desde `src/main.jsx`.
- Favicon y recursos estáticos en `src/images/`.

## Autenticación

- Login en `/` contra `POST /api/auth/login`. Guarda token y usuario en `localStorage` (`ttl-token`, `ttl-user`).
- Rutas protegidas redirigen a `/` si no hay token. Guardas de rol para admin.

## Rutas principales

- `/` Login.
- `/inmuebles` Listado para usuarios (solo lectura).
- `/inmuebles/:id` Detalle de inmueble modo lectura.
- `/admin/inmuebles` Listado admin (crear/editar).
- `/admin/inmuebles/nuevo` Alta de inmueble (`POST /api/inmueble`).
- `/admin/inmuebles/:id/editar` Edición de inmueble (`PUT /api/inmueble/{id}`).
- `/admin/inmuebles/:id` Detalle admin con galería de imágenes.
- `/admin/inmuebles/:id/imagenes/nueva` Alta de imagen (`POST /api/inmueble/{id}/images`).
- `/admin/inmuebles/:id/imagenes/:imageId/editar` Edición de imagen (`PUT /api/inmueble/{id}/images/{imageId}`).

## Entidades esperadas desde la API

- `Inmueble`: `id`, `description`, `propertyType`, `operationType`, `location`, `rooms`, `size`, `antiquity`, `isActive`, `images` (colección).
- `PropertyImage`: `id`, `inmuebleId`, `imageUrl`, `contentType`, `sizeInBytes`, `order`, `isPrimary`.

## Notas de uso

- La tabla de inmuebles pagina de a 10 filas.
- Formularios marcan con asterisco rojo los campos obligatorios.
- Se usa imagen de mapa (`src/images/mapa-ciudad-ilustración-vectorial.jpg`) como fondo de la sección de ubicación en la vista de usuario.
