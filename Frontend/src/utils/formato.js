export function formatearFecha(iso) {
  if (!iso) return "—";
  const [anio, mes, dia] = String(iso).split("-");
  if (!anio || !mes || !dia) return iso;
  return `${dia}/${mes}/${anio}`;
}
export function formatearKm(valor) {
  if (valor === null || valor === undefined || valor === "") return "—";
  return `${Number(valor).toLocaleString("es-CR")} km`;
}
export const esEnteroNoNegativo = (texto) => /^\d+$/.test(String(texto).trim());
