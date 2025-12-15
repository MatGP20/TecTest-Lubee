import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth";
import { createPropertyImage, fetchInmuebleById, updatePropertyImage } from "../api";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const requiredMark = <span className="text-danger ms-1">*</span>;

export default function AdminPropertyImageForm({ mode = "create" }) {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: propertyId, imageId } = useParams();

  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    imageUrl: "",
    contentType: "image/jpeg",
    sizeInBytes: "",
    order: "",
    isPrimary: false
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const stateImage = location.state?.image;
        let image = stateImage;
        if (!image) {
          const data = await fetchInmuebleById(token, propertyId);
          image = data?.images?.find((img) => img.id === imageId);
        }
        if (image) {
          setForm({
            imageUrl: image.imageUrl || "",
            contentType: image.contentType || "image/jpeg",
            sizeInBytes: image.sizeInBytes ?? "",
            order: image.order ?? "",
            isPrimary: image.isPrimary ?? false
          });
        } else {
          setError("Imagen no encontrada");
        }
      } catch (err) {
        if (err.status === 401) {
          logout();
          navigate("/", { replace: true });
          return;
        }
        setError(err.message || "No se pudo cargar la imagen");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isEdit, location.state, token, propertyId, imageId, logout, navigate]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        imageUrl: form.imageUrl.trim(),
        contentType: form.contentType || "image/jpeg",
        sizeInBytes: form.sizeInBytes ? Number(form.sizeInBytes) : 0,
        order: form.order ? Number(form.order) : 0,
        isPrimary: form.isPrimary
      };

      if (isEdit) {
        await updatePropertyImage(token, propertyId, imageId, payload);
      } else {
        await createPropertyImage(token, propertyId, payload);
      }
      navigate(`/admin/inmuebles/${propertyId}`);
    } catch (err) {
      if (err.status === 401) {
        logout();
        navigate("/", { replace: true });
        return;
      }
      setError(err.message || (isEdit ? "No se pudo actualizar la imagen" : "No se pudo crear la imagen"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell dark d-flex flex-column">
      <div className="sticky-top">
        <AppHeader icon="perm_media" title={isEdit ? "Editar Imagen" : "Nueva Imagen"} username={user?.username} onLogout={logout} />
      </div>
      <main className="flex-grow-1 py-4 px-3 px-md-4">
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <div className="d-flex align-items-center gap-2 text-secondary mb-3">
            <a className="text-decoration-none text-secondary" onClick={() => navigate(-1)}>
              Volver
            </a>
            <span>/</span>
            <span className="text-white">{isEdit ? "Editar Imagen" : "Agregar Imagen"}</span>
          </div>
          <div className="surface-card p-4 rounded-4 shadow-lg">
            <h3 className="text-white fw-bold mb-3">Datos de la imagen</h3>
            {loading ? (
              <div className="alert alert-info">Cargando...</div>
            ) : (
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label className="form-label text-white-50">
                    URL de la imagen{requiredMark}
                  </label>
                  <input
                    type="url"
                    className="form-control bg-dark text-white border-secondary"
                    value={form.imageUrl}
                    onChange={handleChange("imageUrl")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50">
                    Content-Type{requiredMark}
                  </label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    value={form.contentType}
                    onChange={handleChange("contentType")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50">
                    Tamaño en bytes{requiredMark}
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control bg-dark text-white border-secondary"
                    value={form.sizeInBytes}
                    onChange={handleChange("sizeInBytes")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50">Orden</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control bg-dark text-white border-secondary"
                    value={form.order}
                    onChange={handleChange("order")}
                  />
                </div>
                <div className="col-md-6 d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isPrimary"
                    checked={form.isPrimary}
                    onChange={(e) => setForm((prev) => ({ ...prev, isPrimary: e.target.checked }))}
                  />
                  <label htmlFor="isPrimary" className="form-check-label text-white-50">
                    Marcar como principal
                  </label>
                </div>

                {error && <div className="col-12 alert alert-danger py-2 mb-0">{error}</div>}

                <div className="col-12 d-flex gap-2 justify-content-end mt-2">
                  <button className="btn btn-outline-light pill-btn" type="button" onClick={() => navigate(-1)}>
                    Cancelar
                  </button>
                  <button className="btn btn-success pill-btn" type="submit" disabled={saving}>
                    {saving ? "Guardando..." : isEdit ? "Actualizar Imagen" : "Guardar Imagen"}
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
