import { get } from "../api/api";

// Envuelve cualquier llamada de api.js: si fetch falla (servidor caído, sin red)
// devuelve { ok: false, status: 0 } en lugar de lanzar la excepción.
export async function llamar(accion) {
  try {
    return await accion();
  } catch {
    return { ok: false, status: 0, datos: null };
  }
}

// { estado: "ACTIVO", page: 2, buscar: "" } -> "?estado=ACTIVO&page=2"
export function construirQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([clave, valor]) => {
    if (valor === undefined || valor === null) return;
    const texto = String(valor).trim();
    if (texto !== "") query.set(clave, texto);
  });
  const resultado = query.toString();
  return resultado ? `?${resultado}` : "";
}

// Recorre todas las páginas de un listado paginado del backend.
// Se usa para llenar selectores (por ejemplo, vehículos en el formulario de mantenimientos).
export async function cargarTodasLasPaginas(ruta) {
  const acumulado = [];
  let pagina = 1;
  let totalPaginas = 1;
  do {
    const res = await llamar(() => get(`${ruta}${construirQuery({ page: pagina })}`));
    if (!res.ok) return res;
    acumulado.push(...res.datos.resultados);
    totalPaginas = res.datos.total_paginas;
    pagina += 1;
  } while (pagina <= totalPaginas && pagina <= 100);
  return { ok: true, status: 200, datos: acumulado };
}
