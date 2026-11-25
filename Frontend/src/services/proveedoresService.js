import { del, get, post, put } from "../api/api";
import { construirQuery, llamar } from "../utils/http";

const RUTA = "/proveedores/";

// GET /proveedores/?buscar=&page=   (buscar filtra por nombre o cédula jurídica)
export const listarProveedores = (params) => llamar(() => get(`${RUTA}${construirQuery(params)}`));
export const obtenerProveedor = (id) => llamar(() => get(`${RUTA}${id}/`));
export const crearProveedor = (datos) => llamar(() => post(RUTA, datos));
export const actualizarProveedor = (id, datos) => llamar(() => put(`${RUTA}${id}/`, datos));
// 409 si el proveedor tiene repuestos asociados (borrado protegido en el backend).
export const eliminarProveedor = (id) => llamar(() => del(`${RUTA}${id}/`));
