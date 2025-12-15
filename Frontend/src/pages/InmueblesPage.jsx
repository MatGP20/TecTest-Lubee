import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { fetchInmuebles } from "../api";
import { sampleProperties } from "../mockData";

const statusVariantClass = {
  success: "success",
  warning: "warning",
  muted: "muted"
};

export default function InmueblesPage() {
  const { token, user, logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchInmuebles(token, isAdmin);
        const normalized = (data || []).map((item, idx) => {
          const preset = sampleProperties[idx % sampleProperties.length];
          return {
            id: item.id || preset.name + idx,
            name: item.description || preset.name,
            propertyType: item.propertyType || preset.name,
            location: item.location || preset.location,
            price: preset.price,
            statusVariant: item.isActive ? "success" : "muted",
            statusLabel: item.isActive ? "Disponible" : "Inactivo",
            operationType: item.operationType || "Venta",
            rooms: item.rooms ?? 0,
            size: item.size ?? 0,
            image: preset.image
          };
        });

        setProperties(normalized.length ? normalized : sampleProperties);
      } catch (err) {
        if (err.status === 401) {
          handleLogout();
          return;
        }
        setError(err.message || "Error cargando inmuebles");
        setProperties(sampleProperties);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, navigate, isAdmin]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const visibleNavLabel = useMemo(() => (isAdmin ? "Admin Inmobiliaria" : "InmoGestión"), [isAdmin]);

  const handleRowClick = (id) => {
    if (!id) return;
    navigate(isAdmin ? `/admin/inmuebles/${id}` : `/inmuebles/${id}`);
  };

  return (
    <div className="page-shell dark d-flex flex-column">
      <header className="sticky-top border-bottom" style={{ borderColor: "var(--border-surface)" }}>
        <div className="bg-glass-dark px-3 py-3">
          <div className="container-fluid d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2 text-white">
                <span className="material-symbols-outlined fs-3 text-success">real_estate_agent</span>
                <span className="fw-bold d-none d-sm-inline">{visibleNavLabel}</span>
              </div>
              <div className="d-none d-md-block">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-transparent border-secondary text-secondary">
                    <span className="material-symbols-outlined fs-6">search</span>
                  </span>
                  <input
                    className="form-control bg-transparent border-secondary text-white"
                    placeholder="Buscar propiedades..."
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              {user && <span className="text-secondary small">Hola, {user.username}</span>}
              <button className="btn btn-outline-light btn-sm pill-btn" onClick={handleLogout}>
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow-1 py-4 px-3 px-sm-4">
        <div className="mx-auto" style={{ maxWidth: "1200px" }}>
          <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-end mb-3">
            <div>
              <h2 className="text-white fw-bold mb-1">Administración de Inmuebles</h2>
              <p className="text-secondary mb-0">
                {isAdmin
                  ? "Gestiona y actualiza tu inventario de propiedades."
                  : "Consulta el inventario disponible."}
              </p>
            </div>
            {isAdmin && (
              <button className="btn btn-success d-flex align-items-center gap-2 pill-btn shadow-strong">
                <span className="material-symbols-outlined fs-6">add</span>
                Agregar Inmueble
              </button>
            )}
          </div>

          {loading && <div className="alert alert-info">Cargando inmuebles...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="surface-card shadow-lg overflow-hidden">
            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr style={{ backgroundColor: "#21301c" }}>
                    <th className="ps-4">Imagen</th>
                    <th>Nombre del Inmueble</th>
                    <th>Ubicación</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    {isAdmin && <th className="text-end pe-4">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {properties.map((item, idx) => (
                    <tr key={item.id || idx} onClick={() => handleRowClick(item.id)}>
                      <td className="ps-4">
                        <div
                          className="rounded-3"
                          style={{
                            width: 64,
                            height: 64,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${item.image})`
                          }}
                        />
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-white fw-bold">{item.name}</span>
                          <small className="text-secondary">ID: {item.id}</small>
                        </div>
                      </td>
                      <td className="text-secondary">
                        <span className="material-symbols-outlined align-middle me-1 fs-6">
                          location_on
                        </span>
                        {item.location}
                      </td>
                      <td className="fw-bold" style={{ color: "var(--primary)" }}>
                        {item.price}
                      </td>
                      <td>
                        <span
                          className={`badge-soft ${statusVariantClass[item.statusVariant] || "muted"}`}
                        >
                          <span className="rounded-circle d-inline-block" style={{ width: 8, height: 8, backgroundColor: "currentColor" }} />
                          {item.statusLabel || item.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              className="btn btn-outline-secondary btn-sm rounded-circle"
                              title="Editar"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(item.id);
                              }}
                            >
                              <span className="material-symbols-outlined fs-6">edit</span>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-circle"
                              title="Eliminar"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="material-symbols-outlined fs-6">delete</span>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="d-flex justify-content-between align-items-center px-4 py-3"
              style={{ borderTop: `1px solid var(--border-surface)`, backgroundColor: "#192416" }}
            >
              <small className="text-secondary d-none d-sm-inline">
                Mostrando {properties.length} inmuebles
              </small>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-light rounded-circle border-0">
                  <span className="material-symbols-outlined fs-6">chevron_left</span>
                </button>
                <button className="btn btn-sm btn-success rounded-circle border-0">1</button>
                <button className="btn btn-sm btn-outline-light rounded-circle border-0">2</button>
                <button className="btn btn-sm btn-outline-light rounded-circle border-0">3</button>
                <button className="btn btn-sm btn-outline-light rounded-circle border-0">
                  <span className="material-symbols-outlined fs-6">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 px-4" style={{ borderTop: "1px solid var(--border-surface)", backgroundColor: "#131b11" }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary gap-2">
          <small>© 2024 Gestión Inmobiliaria. Todos los derechos reservados.</small>
          <div className="d-flex gap-3">
            <a className="text-secondary text-decoration-none" href="#">
              Términos
            </a>
            <a className="text-secondary text-decoration-none" href="#">
              Privacidad
            </a>
            <a className="text-secondary text-decoration-none" href="#">
              Ayuda
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
