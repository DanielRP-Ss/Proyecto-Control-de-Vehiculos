export const CAMPOS_MANTENIMIENTO = [
  "vehiculo",
  "descripcion",
  "kilometraje_objetivo",
  "fecha_programada",
  "estado",
];
export function validarMantenimiento(v, vehiculo) {
  const errores = {};
  if (!v.vehiculo) errores.vehiculo = "Seleccione un vehículo.";
  if (!v.descripcion.trim()) errores.descripcion = "La descripción es obligatoria.";
  if (v.kilometraje_objetivo === "") {
    errores.kilometraje_objetivo = "El kilometraje objetivo es obligatorio.";
  } else if (!/^\d+$/.test(v.kilometraje_objetivo)) {
    errores.kilometraje_objetivo = "Debe ser un número entero positivo.";
  } else if (vehiculo && Number(v.kilometraje_objetivo) <= vehiculo.kilometraje) {
    errores.kilometraje_objetivo = `Debe ser mayor al kilometraje actual del vehículo (${vehiculo.kilometraje} km).`;
  }
  if (!v.fecha_programada) errores.fecha_programada = "La fecha programada es obligatoria.";
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(v.fecha_programada)) errores.fecha_programada = "Fecha no válida.";
  if (!v.estado) errores.estado = "Seleccione un estado.";
  return errores;
}
