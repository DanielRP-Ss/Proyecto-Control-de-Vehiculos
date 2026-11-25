import { del, get, post, put } from "../api/api";
import { cargarTodasLasPaginas, construirQuery, llamar } from "../utils/http";

const RUTA = "/vehiculos/";

// GET /vehiculos/?estado=&kilometraje_min=&kilometraje_max=&page=
export const listarVehiculos = (params) => llamar(() => get(`${RUTA}${construirQuery(params)}`));
export const listarTodosLosVehiculos = () => cargarTodasLasPaginas(RUTA);
export const obtenerVehiculo = (id) => llamar(() => get(`${RUTA}${id}/`));
export const crearVehiculo = (datos) => llamar(() => post(RUTA, datos));
export const actualizarVehiculo = (id, datos) => llamar(() => put(`${RUTA}${id}/`, datos));
export const eliminarVehiculo = (id) => llamar(() => del(`${RUTA}${id}/`));
