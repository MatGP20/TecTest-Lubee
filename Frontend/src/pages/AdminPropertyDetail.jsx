import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth";
import { fetchInmuebleById } from "../api";
import { galleryImages, sampleProperties } from "../mockData";

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
        const preset = sampleProperties[0];
        setProperty({
          id,
          name: data?.description || "Loft Moderno en Centro",
          location: data?.location || "Calle Gran Vía, Madrid",
          price: preset.price || "€450,000",
          status: data?.isActive ? "Disponible" : "Inactivo",
          rooms: data?.rooms ?? 3,
          baths: 2,
          size: data?.size ?? 120,
          year: data?.antiquity ? new Date().getFullYear() - data.antiquity : 2018,
          garage: "Sí (2 plazas)",
          energy: "Clase A",
          type: data?.propertyType || "Apartamento",
          operation: data?.operationType || "Venta",
          description:
            data?.description ||
            "Este espectacular loft de diseño industrial se encuentra en una de las zonas más vibrantes del centro de Madrid. Reformado integralmente en 2018, la propiedad destaca por sus techos de 4 metros de altura y sus grandes ventanales que inundan el espacio de luz natural durante todo el día.",
          images: galleryImages.slice(0, 6)
        });
      } catch (err) {
        if (err.status === 401) {
          handleLogout();
          return;
        }
        setError(err.message || "No se pudo cargar el inmueble");
        const preset = sampleProperties[0];
        setProperty({
          id,
          name: preset.name,
          location: preset.location,
          price: preset.price,
          status: "Disponible",
          rooms: 3,
          baths: 2,
          size: 120,
          year: 2018,
          garage: "Sí (2 plazas)",
          energy: "Clase A",
          type: "Apartamento",
          operation: "Venta",
          description:
            "Propiedad de ejemplo para visualización. Ajusta la configuración de la API para ver datos reales.",
          images: galleryImages.slice(0, 6)
        });
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
    return null;
  }

  return (
    <div className="page-shell dark d-flex flex-column">
      <header className="border-bottom" style={{ borderColor: "var(--border-surface)" }}>
        <div className="bg-glass-dark px-3 py-3">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2 text-white">
                <span className="material-symbols-outlined fs-3 text-success">home_work</span>
                <span className="fw-bold d-none d-sm-inline">Gestión Inmobiliaria</span>
              </div>
              <nav className="d-none d-md-flex align-items-center gap-3">
                <a className="text-white text-decoration-none">Propiedades</a>
                <a className="text-secondary text-decoration-none">Clientes</a>
                <a className="text-secondary text-decoration-none">Reportes</a>
              </nav>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="input-group input-group-sm d-none d-sm-flex" style={{ maxWidth: 220 }}>
                <span className="input-group-text bg-transparent border-secondary text-secondary">
                  <span className="material-symbols-outlined fs-6">search</span>
                </span>
                <input className="form-control bg-transparent border-secondary text-white" placeholder="Buscar..." />
              </div>
              <button className="btn btn-outline-light btn-sm pill-btn" onClick={handleLogout}>
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

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
              <h2 className="text-white fw-black mb-2">{property.name}</h2>
              <div className="text-secondary d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-success">location_on</span>
                <span>ID: {property.id} | {property.location}</span>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light pill-btn d-flex align-items-center gap-2">
                <span className="material-symbols-outlined fs-6">edit</span>
                Editar Información
              </button>
              <button className="btn btn-success pill-btn shadow-strong">Publicar</button>
            </div>
          </div>

          {loading && <div className="alert alert-info">Cargando inmueble...</div>}
          {error && <div className="alert alert-warning">{error}</div>}

          <div className="row g-3 mb-4 border-top border-bottom py-3" style={{ borderColor: "var(--border-surface)" }}>
            <DetailChip icon="payments" label="Precio de Venta" value={property.price} highlight />
            <DetailChip icon="verified" label="Estado" value={property.status} />
            <DetailChip icon="square_foot" label="Superficie" value={`${property.size} m²`} />
            <DetailChip icon="bed" label="Habitaciones" value={property.rooms} />
            <DetailChip icon="bathtub" label="Baños" value={property.baths} />
            <DetailChip icon="calendar_month" label="Año Construcción" value={property.year} />
            <DetailChip icon="garage" label="Garaje" value={property.garage} />
            <DetailChip icon="energy_savings_leaf" label="Cert. Energético" value={property.energy} />
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
              {property.images.map((src, idx) => (
                <div className="gallery-item" key={idx}>
                  <img src={src} alt={`Galería ${idx}`} />
                  <div className="position-absolute top-0 end-0 p-2 d-flex gap-1">
                    <button className="btn btn-sm btn-light rounded-circle">
                      <span className="material-symbols-outlined fs-6">edit</span>
                    </button>
                    <button className="btn btn-sm btn-danger rounded-circle">
                      <span className="material-symbols-outlined fs-6">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              <div className="gallery-item d-flex align-items-center justify-content-center border border-dashed text-secondary">
                <div className="text-center p-3">
                  <span className="material-symbols-outlined d-block mb-2">cloud_upload</span>
                  <small>Arrastrar fotos aquí</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
