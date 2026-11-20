export default function AlertError({ error }) {
  if (!error) return null;

  let mensaje;
  if (!error.status) {
    mensaje = "No se pudo conectar con el servidor";
  } else if (error.status === 400) {
    const campos = error.datos && typeof error.datos === "object" ? error.datos : null;
    if (campos && !campos.error) {
      mensaje = (
        <ul className="mb-0">
          {Object.entries(campos).map(([campo, msgs]) => (
            <li key={campo}>
              <strong>{campo}:</strong> {Array.isArray(msgs) ? msgs.join(" ") : msgs}
            </li>
          ))}
        </ul>
      );
    } else {
      mensaje = (campos && campos.error) || "Datos inválidos";
    }
  } else if (error.status === 401) {
    mensaje = "Sesión expirada. Inicie sesión de nuevo";
  } else if (error.status === 403) {
    mensaje = (error.datos && error.datos.error) || "No tiene permisos para esta operación";
  } else if (error.status === 404) {
    mensaje = "El recurso no existe.";
  } else if (error.status === 409) {
    mensaje = (error.datos && error.datos.error) || "Conflicto: el registro tiene datos asociados";
  } else {
    mensaje = "Ocurrió un error inesperado";
  }

  return <div className="alert alert-danger">{mensaje}</div>;
}