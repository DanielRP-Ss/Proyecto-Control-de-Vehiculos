export const CAMPOS_VEHICULO = ["placa", "marca", "modelo", "anio", "kilometraje", "estado"];
const REGEX_PLACA = /^[A-Za-z0-9-]{3,15}$/;
export function validarVehiculo(v, anioActual = new Date().getFullYear()) {
  const errores = {};
  const placa = v.placa.trim();
  if (!placa) errores.placa = "La placa es obligatoria.";
  else if (!REGEX_PLACA.test(placa)) {
    errores.placa = "Debe tener entre 3 y 15 caracteres: letras, números o guiones.";
  }
  if (!v.marca.trim()) errores.marca = "La marca es obligatoria.";
  else if (v.marca.trim().length > 50) errores.marca = "Máximo 50 caracteres.";
  if (!v.modelo.trim()) errores.modelo = "El modelo es obligatorio.";
  else if (v.modelo.trim().length > 50) errores.modelo = "Máximo 50 caracteres.";
  if (v.anio === "") errores.anio = "El año es obligatorio.";
  else if (!/^\d{4}$/.test(v.anio) || Number(v.anio) < 1900 || Number(v.anio) > anioActual + 1) {
    errores.anio = `Ingrese un año válido entre 1900 y ${anioActual + 1}.`;
  }
  if (v.kilometraje === "") errores.kilometraje = "El kilometraje es obligatorio.";
  else if (!/^\d+$/.test(v.kilometraje)) {
    errores.kilometraje = "Debe ser un número entero mayor o igual a 0.";
  }
  if (!v.estado) errores.estado = "Seleccione un estado.";
  return errores;
}
