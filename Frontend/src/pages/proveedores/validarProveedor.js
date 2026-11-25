export const CAMPOS_PROVEEDOR = ["cedula_juridica", "nombre", "contacto"];
export function validarProveedor(v) {
  const errores = {};
  const cedula = v.cedula_juridica.trim();
  if (!cedula) errores.cedula_juridica = "La cédula jurídica es obligatoria.";
  else if (cedula.length > 25) errores.cedula_juridica = "Máximo 25 caracteres.";
  const nombre = v.nombre.trim();
  if (!nombre) errores.nombre = "El nombre es obligatorio.";
  else if (nombre.length > 120) errores.nombre = "Máximo 120 caracteres.";
  const contacto = v.contacto.trim();
  if (!contacto) errores.contacto = "El contacto es obligatorio.";
  else if (contacto.length > 120) errores.contacto = "Máximo 120 caracteres.";
  return errores;
}
