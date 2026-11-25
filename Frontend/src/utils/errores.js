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
