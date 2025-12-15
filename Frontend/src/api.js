import { API_BASE } from "./config";

export async function fetchInmuebles(token, includeInactive = true) {
  const url = `${API_BASE}/inmueble${includeInactive ? "?includeInactive=true" : ""}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (resp.status === 401) {
    const error = new Error("No autorizado");
    error.status = 401;
    throw error;
  }

  if (resp.status === 404) {
    return [];
  }

  if (!resp.ok) {
    throw new Error("No se pudieron obtener los inmuebles");
  }

  return resp.json();
}
