import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function LoginPage() {
  const { login, loading, error, token } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/inmuebles", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) {
      navigate("/inmuebles");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center app-shell">
      <div className="col-11 col-sm-8 col-md-5 col-lg-4">
        <div className="card card-shadow border-0">
          <div className="card-body p-4">
            <div className="text-center mb-3">
              <h4 className="fw-bold mb-1">TecTest Lubee</h4>
              <p className="text-muted mb-0">Accedé para gestionar inmuebles</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <div className="d-grid">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
