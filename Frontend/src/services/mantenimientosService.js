import { del, get, patch, post } from "../api/api";
import { construirQuery, llamar } from "../utils/http";

const RUTA = "/mantenimientos/";

// GET /mantenimientos/?estado=&vehiculo=&page=
export const listarMantenimientos = (params) => llamar(() => get(`${RUTA}${construirQuery(params)}`));
export const obtenerMantenimiento = (id) => llamar(() => get(`${RUTA}${id}/`));
export const crearMantenimiento = (datos) => llamar(() => post(RUTA, datos));
// PATCH: el backend revalida RN-02 (kilometraje objetivo > kilometraje actual) también aquí.
export const actualizarMantenimiento = (id, datos) => llamar(() => patch(`${RUTA}${id}/`, datos));
export const eliminarMantenimiento = (id) => llamar(() => del(`${RUTA}${id}/`));
