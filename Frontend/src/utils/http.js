import { get } from "../api/api";
export async function llamar(accion) {
  try {
    return await accion();
  } catch {
    return { ok: false, status: 0, datos: null };
  }
}
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
