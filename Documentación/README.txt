Backend TecTest-Lubee
=====================

Vista general
-------------
Solución .NET 8 con arquitectura por capas:
- TecTest-Lubee.WebAPI: API REST (JWT, versionado, Swagger, Serilog, Rate Limiting, CORS).
- TecTest-Lubee.Services: lógica de negocio (Auth, Inmuebles, PropertyImages) y factories.
- TecTest-Lubee.Data: EF Core, entidades y DbContext; seeds iniciales.
- TecTest-Lubee.Core: modelos comunes (JWT settings, Swagger config, etc.).

Autenticación y autorización
----------------------------
- JWT Bearer; clave y parámetros en `appsettings*.json` (`Jwt`).
- Claims incluye rol (`ClaimTypes.Role`). Policies:
  - "Admin": requiere rol Admin (modificaciones, alta/baja, imágenes, creación de usuarios).
  - "User": permite lectura de inmuebles (GET lista y detalle).

Persistencia
------------
- SQL Server (cadena en `ConnectionStrings:DefaultConnection`).
- `TTLDbContext` con entidades `User`, `Inmueble`, `PropertyImage`.
- Migraciones y seeding manual: `DBSeed` se puede ejecutar con `RUN_SEED=true` al iniciar la WebAPI.

Endpoints principales
---------------------
- Auth: `POST /api/auth/login` (JWT).
- Usuarios: `POST /api/auth/users` (Admin) para crear usuario con rol y password.
- Inmuebles: `GET /api/inmueble` y `GET /api/inmueble/{id}` (User/Admin); POST/PUT/PATCH/DELETE sólo Admin.
- Imágenes de propiedad: CRUD bajo `api/inmueble/{propertyId}/images` (Admin).

Configuraciones útiles
----------------------
- Swagger en `http://localhost:5054/swagger` o `https://localhost:7206/swagger` (según perfil).
- CORS: origen permitido por defecto `http://localhost:4200`.
- Rate limiting configurable en `RateLimiting` sección.

Para correr local
-----------------
1) Levantar SQL Server (Docker) y ajustar `DefaultConnection`.
2) Aplicar migraciones: `ASPNETCORE_ENVIRONMENT=Development dotnet ef database update --project Backend/TecTest-Lubee.Back/TecTest-Lubee.Data --startup-project Backend/TecTest-Lubee.Back/TecTest-Lubee.WebAPI --context TTLDbContext`.
3) (Opcional) Seed: `RUN_SEED=true ASPNETCORE_ENVIRONMENT=Development dotnet run --project Backend/TecTest-Lubee.Back/TecTest-Lubee.WebAPI` (sólo carga si la tabla Users está vacía).
4) Ejecutar API: `dotnet run --project Backend/TecTest-Lubee.Back/TecTest-Lubee.WebAPI`.
