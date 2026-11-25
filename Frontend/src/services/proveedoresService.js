import { del, get, post, put } from "../api/api";
import { construirQuery, llamar } from "../utils/http";
const RUTA = "/proveedores/";
export const listarProveedores = (params) => llamar(() => get(`${RUTA}${construirQuery(params)}`));
export const obtenerProveedor = (id) => llamar(() => get(`${RUTA}${id}/`));
export const crearProveedor = (datos) => llamar(() => post(RUTA, datos));
export const actualizarProveedor = (id, datos) => llamar(() => put(`${RUTA}${id}/`, datos));
export const eliminarProveedor = (id) => llamar(() => del(`${RUTA}${id}/`));
