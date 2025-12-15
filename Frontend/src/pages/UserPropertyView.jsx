import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth";
import { fetchInmuebleById } from "../api";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function UserPropertyView() {
  const { token, user, logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
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
          name: data.description || data.propertyType || "Inmueble",
          location: data.location || "Sin ubicación",
          status: data.isActive ? "Activo" : "Inactivo",
          rooms: data.rooms,
          size: data.size,
          antiquity: data.antiquity,
          description: data.description || "Sin descripción",
          operationType: data.operationType || "N/D",
          propertyType: data.propertyType || "N/D",
          amenities: [],
          gallery: data.images?.map((img) => img.imageUrl) || []
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
  }, [token, id, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!property) {
    return (
      <main className="flex-grow-1 w-100 mx-auto px-3 px-md-4 py-4" style={{ maxWidth: 1200 }}>
        {loading && <div className="alert alert-info">Cargando inmueble...</div>}
        {error && <div className="alert alert-warning">{error}</div>}
      </main>
    );
  }

  return (
    <div className="page-shell dark d-flex flex-column">
      <div className="sticky-top">
        <AppHeader icon="villa" title="InmoGestión" username={user?.username} onLogout={handleLogout} />
      </div>

      <main className="flex-grow-1 w-100 mx-auto px-3 px-md-4 py-4" style={{ maxWidth: 1200 }}>
        <div className="d-flex flex-wrap gap-2 align-items-center mb-3 text-secondary">
          <a className="text-decoration-none text-secondary">Inicio</a>
          <span className="material-symbols-outlined fs-6">chevron_right</span>
          <a className="text-decoration-none text-secondary">Inmuebles</a>
          <span className="material-symbols-outlined fs-6">chevron_right</span>
          <span className="text-white fw-medium">{property.name}</span>
        </div>

        <div className="hero-gallery rounded-4 overflow-hidden mb-4">
          <div className="tile main">
            <div
              style={{
                backgroundImage: property.gallery[0]
                  ? `url(${property.gallery[0]})`
                  : "linear-gradient(135deg, #233323, #1a261a)"
              }}
            />
          </div>
          {property.gallery.slice(1, 5).map((src, idx) => (
            <div className="tile" key={idx}>
              <div style={{ backgroundImage: `url(${src})` }} />
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-8 d-flex flex-column gap-4">
            <div className="p-3 p-md-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                  <h1 className="text-white fw-bold mb-2">{property.name}</h1>
                  <div className="text-secondary d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined">location_on</span>
                    <span>{property.location}</span>
                  </div>
                </div>
          <div className="text-md-end">
                  <div className="fs-3 fw-bold text-success">{property.size ? `${property.size} m²` : "Sin dato"}</div>
                  <small className="text-secondary">Superficie</small>
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="chip bg-success bg-opacity-25 text-success">
                  <span className="material-symbols-outlined fs-6">sell</span>
                  {property.operationType}
                </span>
                <span className="chip">{property.propertyType}</span>
                <span className="chip">{property.status}</span>
              </div>
            </div>

            <div className="p-3 p-md-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
              <div className="row g-3">
                <Feature icon="bed" label="Ambientes" value={property.rooms ?? "N/D"} />
                <Feature icon="square_foot" label="Área" value={property.size ? `${property.size} m²` : "N/D"} />
                <Feature icon="schedule" label="Antigüedad" value={property.antiquity ?? "N/D"} />
              </div>
            </div>

            <div className="p-3 p-md-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
              <h4 className="text-white fw-bold mb-2">Descripción</h4>
              <p className="text-secondary lh-lg mb-0">{property.description}</p>
            </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="p-3 p-md-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
                  <h4 className="text-white fw-bold mb-3">Comodidades</h4>
                  <div className="row g-2">
                    {property.amenities.map((amenity) => (
                      <div className="col-6 col-sm-4 d-flex align-items-center gap-2 text-white" key={amenity}>
                        <span className="material-symbols-outlined text-success">check_circle</span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="p-3 p-md-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
              <h4 className="text-white fw-bold mb-3">Ubicación</h4>
              <div
                className="w-100 rounded-4 overflow-hidden position-relative"
                style={{
                  backgroundImage: "url('/src/images/mapa-ciudad-ilustración-vectorial.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: 260
                }}
              >
                <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                    <span className="material-symbols-outlined text-white">location_on</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 d-flex flex-column gap-4">
            <div className="p-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle" style={{ top: 90 }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-circle border border-success" style={{ width: 64, height: 64, backgroundColor: "#233323" }} />
                <div>
                  <small className="text-secondary d-block">Agente Inmobiliario</small>
                  <h5 className="text-white mb-0">Equipo Lubee</h5>
                </div>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-success pill-btn d-flex align-items-center justify-content-center gap-2">
                  <span className="material-symbols-outlined">chat</span>
                  Contactar
                </button>
                <button className="btn btn-outline-light pill-btn d-flex align-items-center justify-content-center gap-2">
                  <span className="material-symbols-outlined">mail</span>
                  Enviar Correo
                </button>
              </div>
            </div>

            <div className="p-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
              <h5 className="text-white fw-bold mb-3">Detalles Técnicos</h5>
              <div className="d-flex flex-column gap-2 text-white">
                <TechRow label="Tipo de Inmueble" value={property.propertyType} />
                <TechRow label="Operación" value={property.operationType} />
                <TechRow label="Estado" value={property.status} />
              </div>
            </div>

            {/* <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-primary">
              <h6 className="fw-bold">Vista de Solo Lectura</h6>
              <p className="mb-0 small text-white">
                Estás viendo este inmueble como usuario invitado. No puedes editar la información mostrada.
              </p>
            </div> */}
          </div>
        </div>
      </main>

      <AppFooter text="© 2024 InmoGestión. Todos los derechos reservados." align="center" />
    </div>
  );
}

function Feature({ icon, label, value }) {
  return (
    <div className="col-6 col-md-3 d-flex align-items-center gap-2">
      <div className="rounded-circle bg-success bg-opacity-25 text-success d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <small className="text-secondary text-uppercase">{label}</small>
        <div className="text-white fw-bold">{value}</div>
      </div>
    </div>
  );
}

function TechRow({ label, value }) {
  return (
    <div className="d-flex justify-content-between border-bottom border-secondary-subtle pb-2">
      <span className="text-secondary">{label}</span>
      <span className="fw-semibold">{value}</span>
    </div>
  );
}
