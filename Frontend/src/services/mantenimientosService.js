import { del, get, patch, post } from "../api/api";
import { construirQuery, llamar } from "../utils/http";
const RUTA = "/mantenimientos/";
export const listarMantenimientos = (params) => llamar(() => get(`${RUTA}${construirQuery(params)}`));
export const obtenerMantenimiento = (id) => llamar(() => get(`${RUTA}${id}/`));
export const crearMantenimiento = (datos) => llamar(() => post(RUTA, datos));
export const actualizarMantenimiento = (id, datos) => llamar(() => patch(`${RUTA}${id}/`, datos));
export const eliminarMantenimiento = (id) => llamar(() => del(`${RUTA}${id}/`));
