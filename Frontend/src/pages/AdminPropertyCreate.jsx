import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth";
import { createInmueble, fetchInmuebleById, updateInmueble } from "../api";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const requiredMark = <span className="text-danger ms-1">*</span>;

export default function AdminPropertyCreate({ mode = "create" }) {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [form, setForm] = useState({
    id: "",
    propertyType: "",
    operationType: "",
    description: "",
    rooms: "",
    size: "",
    antiquity: "",
    location: "",
    isActive: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(mode === "edit");

  const isEdit = mode === "edit";

  useEffect(() => {
    const loadData = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        // Prefer state passed from navigation to avoid extra fetch
        const stateData = location.state?.inmueble;
        let data = stateData;
        if (!data) {
          const id = params.id;
          data = await fetchInmuebleById(token, id);
        }
        if (data) {
          setForm({
            id: data.id,
            propertyType: data.propertyType || "",
            operationType: data.operationType || "",
            description: data.description || "",
            rooms: data.rooms ?? "",
            size: data.size ?? "",
            antiquity: data.antiquity ?? "",
            location: data.location || "",
            isActive: data.isActive
          });
        }
      } catch (err) {
        if (err.status === 401) {
          logout();
          navigate("/", { replace: true });
          return;
        }
        setError(err.message || "No se pudo cargar el inmueble");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isEdit, location.state, params.id, token, logout, navigate]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        propertyType: form.propertyType.trim(),
        operationType: form.operationType || null,
        description: form.description.trim(),
        rooms: Number(form.rooms) || 0,
        size: Number(form.size) || 0,
        antiquity: form.antiquity ? Number(form.antiquity) : null,
        location: form.location || null,
        isActive: form.isActive
      };
      if (isEdit) {
        await updateInmueble(token, form.id, payload);
      } else {
        await createInmueble(token, payload);
      }
      navigate("/admin/inmuebles");
    } catch (err) {
      if (err.status === 401) {
        logout();
        navigate("/", { replace: true });
        return;
      }
      setError(err.message || (isEdit ? "No se pudo actualizar el inmueble" : "No se pudo crear el inmueble"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell dark d-flex flex-column">
      <div className="sticky-top">
        <AppHeader icon="add_home_work" title={isEdit ? "Editar Inmueble" : "Nuevo Inmueble"} username={user?.username} onLogout={logout} />
      </div>

      <main className="flex-grow-1 py-4 px-3 px-md-4">
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <div className="d-flex align-items-center gap-2 text-secondary mb-3">
            <a className="text-decoration-none text-secondary" onClick={() => navigate(-1)}>
              Volver
            </a>
            <span>/</span>
            <span className="text-white">{isEdit ? "Editar Inmueble" : "Crear Inmueble"}</span>
          </div>

          <div className="surface-card p-4 rounded-4 shadow-lg">
            <h3 className="text-white fw-bold mb-3">Datos del Inmueble</h3>
            {loading ? (
              <div className="alert alert-info">Cargando inmueble...</div>
            ) : (
              <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label className="form-label text-white-50">
                  Tipo de Inmueble{requiredMark}
                </label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.propertyType}
                  onChange={handleChange("propertyType")}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-white-50">Tipo de Operación</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.operationType}
                  onChange={handleChange("operationType")}
                  placeholder="Venta / Alquiler / etc."
                />
              </div>
              <div className="col-12">
                <label className="form-label text-white-50">
                  Descripción{requiredMark}
                </label>
                <textarea
                  className="form-control bg-dark text-white border-secondary"
                  rows={3}
                  value={form.description}
                  onChange={handleChange("description")}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-white-50">
                  Ambientes{requiredMark}
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.rooms}
                  onChange={handleChange("rooms")}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-white-50">
                  Tamaño (m²){requiredMark}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.size}
                  onChange={handleChange("size")}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-white-50">Antigüedad (años)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.antiquity}
                  onChange={handleChange("antiquity")}
                />
              </div>
              <div className="col-12">
                <label className="form-label text-white-50">Ubicación</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  value={form.location}
                  onChange={handleChange("location")}
                />
              </div>
              <div className="col-12 d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                <label htmlFor="isActive" className="form-check-label text-white-50">
                  Activo
                </label>
              </div>

              {error && <div className="col-12 alert alert-danger py-2 mb-0">{error}</div>}

              <div className="col-12 d-flex gap-2 justify-content-end mt-2">
                <button className="btn btn-outline-light pill-btn" type="button" onClick={() => navigate(-1)}>
                  Cancelar
                </button>
                <button className="btn btn-success pill-btn" type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar Inmueble"}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </main>

      <AppFooter text="© 2025 TTL Inmuebles SA. Todos los derechos reservados." align="between" />
    </div>
  );
}
