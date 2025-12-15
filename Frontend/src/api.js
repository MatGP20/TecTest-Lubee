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

export async function fetchInmuebleById(token, id) {
  const resp = await fetch(`${API_BASE}/inmueble/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (resp.status === 404) {
    return null;
  }

  if (resp.status === 401) {
    const error = new Error("No autorizado");
    error.status = 401;
    throw error;
  }

  if (!resp.ok) {
    throw new Error("No se pudo obtener el inmueble");
  }

  return resp.json();
}

export async function createInmueble(token, payload) {
  const resp = await fetch(`${API_BASE}/inmueble`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (resp.status === 401) {
    const error = new Error("No autorizado");
    error.status = 401;
    throw error;
  }

  if (!resp.ok) {
    const message = await resp.text();
    throw new Error(message || "No se pudo crear el inmueble");
  }

  return resp.json();
}

export async function updateInmueble(token, id, payload) {
  const resp = await fetch(`${API_BASE}/inmueble/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (resp.status === 401) {
    const error = new Error("No autorizado");
    error.status = 401;
    throw error;
  }

  if (resp.status === 404) {
    const error = new Error("Inmueble no encontrado");
    error.status = 404;
    throw error;
  }

  if (!resp.ok) {
    const message = await resp.text();
    throw new Error(message || "No se pudo actualizar el inmueble");
  }

  return true;
}

export async function createPropertyImage(token, propertyId, payload) {
  const resp = await fetch(`${API_BASE}/inmueble/${propertyId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (resp.status === 401) {
    const error = new Error("No autorizado");
    error.status = 401;
    throw error;
  }

  if (!resp.ok) {
    const message = await resp.text();
    throw new Error(message || "No se pudo crear la imagen");
  }

  return resp.json();
}

export async function updatePropertyImage(token, propertyId, imageId, payload) {
  const resp = await fetch(`${API_BASE}/inmueble/${propertyId}/images/${imageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (resp.status === 401) {
    const error = new Error("No autorizado");
    error.status = 401;
    throw error;
  }

  if (resp.status === 404) {
    const error = new Error("Imagen no encontrada");
    error.status = 404;
    throw error;
  }

  if (!resp.ok) {
    const message = await resp.text();
    throw new Error(message || "No se pudo actualizar la imagen");
  }

  return true;
}
