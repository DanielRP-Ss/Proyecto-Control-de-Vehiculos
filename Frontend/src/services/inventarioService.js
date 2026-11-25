import { get, post, patch, del } from "../api/api";
import {
  construirQuery,
  llamar,
  cargarTodasLasPaginas
} from "../utils/http";
const RUTA = "/inventario/";
export const listarRepuestos = (params) =>
  llamar(() => get(RUTA + construirQuery(params)));
export const obtenerRepuesto = (id) =>
  llamar(() => get(`${RUTA}${id}/`));
export const crearRepuesto = (datos) =>
  llamar(() => post(RUTA, datos));
export const actualizarRepuesto = (id, datos) =>
  llamar(() => patch(`${RUTA}${id}/`, datos));
export const eliminarRepuesto = (id) =>
  llamar(() => del(`${RUTA}${id}/`));
export const listarTodosLosRepuestos = () =>
  cargarTodasLasPaginas(RUTA);
export const resumenInventario = () =>
  llamar(() => get(RUTA + "resumen/"));
export const registrarConsumo = (datos) =>
  llamar(() => post(RUTA + "consumos/", datos));
