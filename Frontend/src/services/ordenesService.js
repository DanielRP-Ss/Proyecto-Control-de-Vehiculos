import { get, post, patch, del } from "../api/api";
import { construirQuery, llamar } from "../utils/http";
const RUTA = "/ordenes/";
export const listarOrdenes = (params) =>
  llamar(() => get(RUTA + construirQuery(params)));
export const obtenerOrden = (id) =>
  llamar(() => get(`${RUTA}${id}/`));
export const crearOrden = (datos) =>
  llamar(() => post(RUTA, datos));
export const actualizarOrden = (id, datos) =>
  llamar(() => patch(`${RUTA}${id}/`, datos));
export const eliminarOrden = (id) =>
  llamar(() => del(`${RUTA}${id}/`));
export const listarConsumos = (params) =>
  llamar(() => get("/comentarios/" + construirQuery(params)));
