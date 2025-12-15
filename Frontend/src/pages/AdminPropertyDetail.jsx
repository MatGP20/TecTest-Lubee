import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth";
import { fetchInmuebleById } from "../api";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function AdminPropertyDetail() {
  const { token, user, logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate("/inmuebles", { replace: true });
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchInmuebleById(token, id);
        if (!data) {
          setError("Inmueble no encontrado");
          return;
        }
        setProperty({
          id: data.id,
          description: data.description || "Sin descripción",
          location: data.location || "Sin ubicación",
          isActive: data.isActive,
          propertyType: data.propertyType || "N/D",
          operationType: data.operationType || "N/D",
          rooms: data.rooms,
          size: data.size,
          antiquity: data.antiquity,
          images: data.images || []
        });
      } catch (err) {
        if (err.status === 401) {
          handleLogout();
          return;
        }
        setError(err.message || "No se pudo cargar el inmueble");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, id, navigate, isAdmin]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!property) {
    return (
      <div className="page-shell dark d-flex flex-column">
        <main className="flex-grow-1 py-4 px-3 px-md-4">
          {loading ? <div className="alert alert-info">Cargando inmueble...</div> : null}
          {error ? <div className="alert alert-warning">{error}</div> : null}
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell dark d-flex flex-column">
      <div className="sticky-top">
        <AppHeader icon="home_work" title="Gestión Inmobiliaria" username={user?.username} onLogout={handleLogout} />
      </div>

      <main className="flex-grow-1 py-4 px-3 px-md-4">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="d-flex flex-wrap gap-2 align-items-center text-secondary mb-3">
            <a className="text-decoration-none text-secondary">Inicio</a>
            <span>/</span>
            <a className="text-decoration-none text-secondary">Propiedades</a>
            <span>/</span>
            <span className="text-white">Detalle</span>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end gap-3 mb-4">
            <div>
              <h2 className="text-white fw-black mb-2">{property.description}</h2>
              <div className="text-secondary d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-success">location_on</span>
                <span>ID: {property.id} | {property.location}</span>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light pill-btn d-flex align-items-center gap-2"
                onClick={() => navigate(`/admin/inmuebles/${property.id}/editar`, { state: { inmueble: property } })}
              >
                <span className="material-symbols-outlined fs-6">edit</span>
                Editar Información
              </button>
              <button className="btn btn-success pill-btn shadow-strong">Publicar</button>
            </div>
          </div>

          {loading && <div className="alert alert-info">Cargando inmueble...</div>}
          {error && <div className="alert alert-warning">{error}</div>}

          <div className="row g-3 mb-4 border-top border-bottom py-3" style={{ borderColor: "var(--border-surface)" }}>
            <DetailChip icon="home" label="Tipo" value={property.propertyType} />
            <DetailChip icon="assignment" label="Operación" value={property.operationType} />
            <DetailChip icon="verified" label="Estado" value={property.isActive ? "Activo" : "Inactivo"} highlight={property.isActive} />
            <DetailChip icon="square_foot" label="Superficie" value={property.size ? `${property.size} m²` : "N/D"} />
            <DetailChip icon="bed" label="Ambientes" value={property.rooms ?? "N/D"} />
            <DetailChip icon="update" label="Antigüedad" value={property.antiquity ?? "N/D"} />
          </div>

          <div className="mb-4">
            <h4 className="text-white fw-bold mb-2">Descripción del Inmueble</h4>
            <p className="text-secondary lh-lg">{property.description}</p>
          </div>

          <div className="p-4 surface-card rounded-4 shadow-lg">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-dark text-success">
                  <span className="material-symbols-outlined">perm_media</span>
                </div>
                <div>
                  <h5 className="text-white mb-0">Galería Multimedia</h5>
                  <small className="text-secondary">Gestiona las fotos de la propiedad</small>
                </div>
              </div>
              <button className="btn btn-success pill-btn d-flex align-items-center gap-2">
                <span className="material-symbols-outlined fs-6">add_photo_alternate</span>
                Agregar Imágenes
              </button>
            </div>
            <div className="grid-gallery">
              {property.images.length > 0 ? (
                property.images.map((img, idx) => (
                  <div className="gallery-item" key={img.id || idx}>
                    <img src={img.imageUrl} alt={img.contentType || `Imagen ${idx}`} />
                  </div>
                ))
              ) : (
                <div className="text-secondary">No hay imágenes cargadas.</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <AppFooter text="© 2025 TTL Inmuebles SA. Todos los derechos reservados." align="between" />
    </div>
  );
}

function DetailChip({ icon, label, value, highlight = false }) {
  return (
    <div className="col-6 col-md-3">
      <div className="d-flex flex-column gap-1">
        <div className="d-flex align-items-center gap-1 text-secondary">
          <span className="material-symbols-outlined fs-6">{icon}</span>
          <small className="fw-medium">{label}</small>
        </div>
        <span className={`fw-bold ${highlight ? "text-success" : "text-white"}`}>{value}</span>
      </div>
    </div>
  );
}
