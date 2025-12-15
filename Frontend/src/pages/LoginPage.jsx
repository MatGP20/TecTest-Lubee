import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      const role = result.user?.role?.toLowerCase();
      navigate(role === "admin" ? "/admin/inmuebles" : "/inmuebles");
    }
  };

  return (
    <div className="login-shell">
      <div className="container-fluid h-100">
        <div className="row g-0 min-vh-100">
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-center px-4 px-lg-5 py-5 position-relative">
            <div className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2">
              <div className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-25 text-success" style={{ width: 48, height: 48 }}>
                <span className="material-symbols-outlined fs-3">apartment</span>
              </div>
              <span className="fw-bold fs-5">TTL Inmuebles</span>
            </div>

            <div className="mx-auto" style={{ maxWidth: 440, width: "100%" }}>
              <div className="mb-4">
                <h1 className="fw-black display-6 mb-2">Bienvenido</h1>
                <p className="text-secondary fs-6 mb-0">
                  Por favor ingresa tu nombre de usuario y contraseña.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label text-white-50">Usuario</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control rounded-pill bg-dark text-white border-success border-opacity-50 px-4 py-3"
                      placeholder="name@company.com"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoFocus
                    />
                    <span className="material-symbols-outlined text-secondary position-absolute top-50 end-0 translate-middle-y me-3">
                      mail
                    </span>
                  </div>
                </div>

                <div>
                  <label className="form-label text-white-50">Contraseña</label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control rounded-pill bg-dark text-white border-success border-opacity-50 px-4 py-3"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link text-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>

                {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}

                <div>
                  <button
                    className="btn btn-success w-100 rounded-pill py-3 fw-bold text-dark"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Ingresando..." : "Ingresar"}
                  </button>
                </div>
              </form>

              <div className="text-center text-secondary mt-4">
                <small>© 2025 TTL Inmuebles SA. Todos los derechos reservados.</small>
              </div>
            </div>
          </div>

          <div className="d-none d-lg-flex col-lg-6 login-hero">
            <div className="login-hero-content d-flex flex-column justify-content-end p-5">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
