import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { fetchInmuebles } from "../api";

export default function InmueblesPage() {
  const { token, user, logout } = useAuth();
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchInmuebles(token);
        setInmuebles(data);
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
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="app-shell d-flex flex-column">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand fw-semibold">TecTest Lubee</span>
          <div className="d-flex align-items-center">
            {user && <span className="text-white me-3 small">Hola, {user.username}</span>}
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="container my-4 flex-grow-1">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="mb-0">Inmuebles</h4>
          <span className="badge text-bg-secondary">{inmuebles.length} registros</span>
        </div>

        {loading && <div className="alert alert-info">Cargando inmuebles...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && inmuebles.length === 0 && (
          <div className="alert alert-warning">No hay inmuebles para mostrar.</div>
        )}

        {!loading && inmuebles.length > 0 && (
          <div className="table-responsive card card-shadow border-0">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tipo</th>
                  <th>Operación</th>
                  <th className="text-center">Ambientes</th>
                  <th className="text-center">Tamaño (m²)</th>
                  <th>Ubicación</th>
                  <th className="text-center">Activo</th>
                </tr>
              </thead>
              <tbody>
                {inmuebles.map((item) => (
                  <tr key={item.id}>
                    <td>{item.propertyType}</td>
                    <td>{item.operationType || "-"}</td>
                    <td className="text-center">{item.rooms}</td>
                    <td className="text-center">{item.size}</td>
                    <td>{item.location || "Sin ubicación"}</td>
                    <td className="text-center">
                      <span
                        className={`badge text-bg-${item.isActive ? "success" : "secondary"}`}
                      >
                        {item.isActive ? "Sí" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
