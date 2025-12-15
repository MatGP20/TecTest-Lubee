import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { fetchInmuebles } from "../api";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const statusVariantClass = {
  true: "success",
  false: "muted"
};

export default function InmueblesPage() {
  const { token, user, logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const pageSize = 10;

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
        const normalized = (data || []).map((item) => {
          const primaryImage = item.images?.find((img) => img.isPrimary) || item.images?.[0];
          return {
            id: item.id,
            name: item.description || item.propertyType || "Sin descripción",
            propertyType: item.propertyType || "N/D",
            operationType: item.operationType || "N/D",
            location: item.location || "Sin ubicación",
            size: item.size,
            rooms: item.rooms,
            isActive: item.isActive,
            image: primaryImage?.imageUrl
          };
        });

        setProperties(normalized);
        setPage(1);
      } catch (err) {
        if (err.status === 401) {
          handleLogout();
          return;
        }
        setError(err.message || "Error cargando inmuebles");
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

  const totalPages = Math.max(1, Math.ceil(properties.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return properties.slice(start, end);
  }, [properties, currentPage]);

  const handlePageChange = (nextPage) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(safePage);
  };

  return (
    <div className="page-shell dark d-flex flex-column">
      <div className="sticky-top">
        <AppHeader icon="real_estate_agent" title={visibleNavLabel} username={user?.username} onLogout={handleLogout} />
      </div>

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
              <button
                className="btn btn-success d-flex align-items-center gap-2 pill-btn shadow-strong"
                onClick={() => navigate("/admin/inmuebles/nuevo")}
              >
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
                    <th>Tamaño</th>
                    <th>Estado</th>
                    {isAdmin && <th className="text-end pe-4">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item, idx) => (
                    <tr key={item.id || idx} onClick={() => handleRowClick(item.id)}>
                      <td className="ps-4">
                        <div
                          className="rounded-3"
                          style={{
                            width: 64,
                            height: 64,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: item.image
                              ? `url(${item.image})`
                              : "linear-gradient(135deg, #233323, #1a261a)"
                          }}
                        />
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-white fw-bold">{item.name}</span>
                          <small className="text-secondary">Tipo: {item.propertyType}</small>
                        </div>
                      </td>
                      <td className="text-secondary">
                        <span className="material-symbols-outlined align-middle me-1 fs-6">
                          location_on
                        </span>
                        {item.location}
                      </td>
                      <td className="fw-bold text-white">
                        {item.size ? `${item.size} m²` : "Sin dato"}
                      </td>
                      <td>
                        <span
                          className={`badge-soft ${statusVariantClass[item.isActive] || "muted"}`}
                        >
                          <span className="rounded-circle d-inline-block" style={{ width: 8, height: 8, backgroundColor: "currentColor" }} />
                          {item.isActive ? "Activo" : "Inactivo"}
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
                {properties.length
                  ? `Mostrando ${Math.min((currentPage - 1) * pageSize + 1, properties.length)}-${Math.min(
                      currentPage * pageSize,
                      properties.length
                    )} de ${properties.length}`
                  : "Sin inmuebles"}
              </small>
              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-sm btn-outline-light rounded-circle border-0"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="material-symbols-outlined fs-6">chevron_left</span>
                </button>
                <span className="text-secondary small">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-outline-light rounded-circle border-0"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span className="material-symbols-outlined fs-6">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AppFooter text="© 2025 TTL Inmuebles SA. Todos los derechos reservados." align="between" />
    </div>
  );
}
