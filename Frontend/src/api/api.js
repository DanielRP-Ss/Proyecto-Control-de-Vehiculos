const BASE_URL = import.meta.env.VITE_API_URL;
export async function api(metodo, ruta, body) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Token ${token}`;
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    method: metodo,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (respuesta.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (!location.pathname.startsWith("/login")) location.href = "/login";
  }
  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);
  return { ok: respuesta.ok, status: respuesta.status, datos };
}
export const get = (ruta) => api("GET", ruta);
export const post = (ruta, body) => api("POST", ruta, body);
export const patch = (ruta, body) => api("PATCH", ruta, body);
export const put = (ruta, body) => api("PUT", ruta, body);
export const del = (ruta) => api("DELETE", ruta);
