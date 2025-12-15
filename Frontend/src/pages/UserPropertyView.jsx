import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth";
import { fetchInmuebleById } from "../api";
import { galleryImages, sampleProperties } from "../mockData";

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
        const preset = sampleProperties[1];
        setProperty({
          id,
          name: data?.description || "Apartamento de Lujo en el Centro",
          location: data?.location || "Av. Principal 123, Ciudad Capital, CP 10020",
          price: preset.price || "$450,000",
          status: data?.isActive ? "En Venta" : "No disponible",
          rooms: data?.rooms ?? 3,
          baths: 2,
          size: data?.size ?? 120,
          parking: 2,
          description:
            data?.description ||
            "Espectacular apartamento totalmente remodelado ubicado en el corazón financiero de la ciudad.",
          amenities: ["Piscina", "Gimnasio", "Lavandería", "Seguridad 24/7", "Balcón Panorámico", "Aire Acondicionado"],
          gallery: galleryImages.slice(0, 6)
        });
      } catch (err) {
        if (err.status === 401) {
          handleLogout();
          return;
        }
        setError(err.message || "No se pudo cargar el inmueble");
        const preset = sampleProperties[1];
        setProperty({
          id,
          name: preset.name,
          location: preset.location,
          price: preset.price,
          status: "En Venta",
          rooms: 3,
          baths: 2,
          size: 120,
          parking: 2,
          description: "Propiedad de ejemplo en modo lectura.",
          amenities: ["Piscina", "Gimnasio", "Seguridad 24/7"],
          gallery: galleryImages.slice(0, 6)
        });
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
    return null;
  }

  return (
    <div className="page-shell dark d-flex flex-column">
      <header className="border-bottom" style={{ borderColor: "var(--border-surface)" }}>
        <div className="bg-glass-dark px-3 py-3">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined fs-3 text-success">villa</span>
              <span className="fw-bold text-white d-none d-sm-inline">InmoGestión</span>
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
            <div style={{ backgroundImage: `url(${property.gallery[0]})` }} />
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
                  <div className="fs-3 fw-bold text-success">{property.price}</div>
                  <small className="text-secondary">Precio de venta</small>
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="chip bg-success bg-opacity-25 text-success">
                  <span className="material-symbols-outlined fs-6">sell</span>
                  {property.status}
                </span>
                <span className="chip">Recién Remodelado</span>
                <span className="chip">Amueblado</span>
              </div>
            </div>

            <div className="p-3 p-md-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
              <div className="row g-3">
                <Feature icon="bed" label="Habitaciones" value={property.rooms} />
                <Feature icon="bathtub" label="Baños" value={property.baths} />
                <Feature icon="square_foot" label="Área" value={`${property.size} m²`} />
                <Feature icon="directions_car" label="Parking" value={property.parking} />
              </div>
            </div>

            <div className="p-3 p-md-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
              <h4 className="text-white fw-bold mb-2">Descripción</h4>
              <p className="text-secondary lh-lg mb-0">{property.description}</p>
            </div>

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

            <div className="p-3 p-md-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
              <h4 className="text-white fw-bold mb-3">Ubicación</h4>
              <div
                className="w-100 rounded-4 overflow-hidden position-relative"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCSixREoxwkj4NqF2Ou9p1wv65RuC05ZcfDhhhucxXvw8a4Vmt5E3WWApZuYifB0iOyyO1W1iaISYCGU16G7690Cpwhb4q-wDLLDq-VGQKS3vBrZ3O7F9n4xBmmFxmcM_O9GZv-ppuA7BWOngL5xTkGu52972xgP4tIZiaTMNqECABIS0Nbo_IrDjI5g_2E09kB1PfWpUCbVZ_ngqmXOJzA1HSCEMsKKt8JSZ_KwmQn1nvovWdKzMm5eOiWuYgatnMq5ME5hKOtxiLm')",
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
            <div className="p-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle position-sticky" style={{ top: 90 }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle border border-success"
                  style={{
                    width: 64,
                    height: 64,
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAEODeQ7Lpw_f4ojehKWVtdvfkgYIpHuC7BeSDuXNW56hlwCxeYGvXMPaLqY8vCSs6rDPffZqboacroI98sNLHuqJXLO_EjSezBhX1RcfzSxWGdSQptwMIbPdbMpq-W4VLNbO4r8U5_YhfPY6vl_ZryzAZfd_t91-UKe_P6x1fqAq1l-Ytw4IMSKYqeDkCqKIClYoH114j7vHEGGeC3xDz4G-fBRKZYq3Q5Ny0Amq-BGV6m1M_4gPrTECSW8xlrF-RqDRMeMWOBDeGr')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                <div>
                  <small className="text-secondary d-block">Agente Inmobiliario</small>
                  <h5 className="text-white mb-0">Carlos Mendoza</h5>
                  <div className="text-warning small">★★★★☆</div>
                </div>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-success pill-btn d-flex align-items-center justify-content-center gap-2">
                  <span className="material-symbols-outlined">chat</span>
                  Contactar por WhatsApp
                </button>
                <button className="btn btn-outline-light pill-btn d-flex align-items-center justify-content-center gap-2">
                  <span className="material-symbols-outlined">mail</span>
                  Enviar Correo
                </button>
              </div>
              <div className="border-top border-secondary-subtle mt-3 pt-3 text-center text-secondary">
                <small>Referencia: #PROP-8821</small>
              </div>
            </div>

            <div className="p-4 bg-white bg-opacity-10 rounded-4 border border-secondary-subtle">
              <h5 className="text-white fw-bold mb-3">Detalles Técnicos</h5>
              <div className="d-flex flex-column gap-2 text-white">
                <TechRow label="Tipo de Inmueble" value="Apartamento" />
                <TechRow label="Año de Construcción" value="2018" />
                <TechRow label="Mantenimiento (HOA)" value="$150 / mes" />
                <TechRow label="Impuesto Predial" value="$1,200 / año" />
                <TechRow label="Zonificación" value="Residencial R3" />
              </div>
            </div>

            <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-primary">
              <h6 className="fw-bold">Vista de Solo Lectura</h6>
              <p className="mb-0 small text-white">
                Estás viendo este inmueble como usuario invitado. No puedes editar la información mostrada.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-secondary border-top" style={{ borderColor: "var(--border-surface)" }}>
        <small>© 2024 InmoGestión. Todos los derechos reservados.</small>
      </footer>
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
