import { cargarTodasLasPaginas } from "../../utils/http";
export const listarTodosLosProveedores = () =>
  cargarTodasLasPaginas("/proveedores/");
export const dinero = (valor) =>
  Number(valor).toLocaleString("es-CR", {
    style: "currency",
    currency: "CRC"
  });
export const fecha = (valor) =>
  valor ? new Date(valor).toLocaleString("es-CR") : "—";
export const activa = (orden) =>
  ["ABIERTA", "EN_PROCESO"].includes(orden.estado);
export const estados = [
  "ABIERTA",
  "EN_PROCESO",
  "COMPLETADA",
  "CANCELADA"
];
export const sinConsulta = async () => ({
  ok: true,
  datos: null
});
export const fechaLocal = (valor) => {
  if (!valor) return "";
  const d = new Date(valor);
  return new Date(
    d.getTime() - d.getTimezoneOffset() * 60000
  ).toISOString().slice(0, 16);
};
