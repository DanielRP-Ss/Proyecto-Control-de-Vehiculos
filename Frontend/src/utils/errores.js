// Separa los errores 400 del serializador (por campo) del resto de errores.
//   porCampo: { placa: "Ya existe ...", ... }  -> se muestran bajo cada input
//   general:  objeto de error para <AlertError /> (401, 403, 404, 409, 500, red, o
//             un 400 con claves que no son campos del formulario)
export function separarErrores(error, campos) {
  const porCampo = {};
  if (!error) return { porCampo, general: null };

  const esMapaDeCampos =
    error.status === 400 &&
    error.datos &&
    typeof error.datos === "object" &&
    !Array.isArray(error.datos);

  if (!esMapaDeCampos) return { porCampo, general: error };

  const resto = {};
  Object.entries(error.datos).forEach(([clave, valor]) => {
    if (campos.includes(clave)) {
      porCampo[clave] = Array.isArray(valor) ? valor.join(" ") : String(valor);
    } else {
      resto[clave] = valor;
    }
  });
  const general = Object.keys(resto).length > 0 ? { ...error, datos: resto } : null;
  return { porCampo, general };
}
