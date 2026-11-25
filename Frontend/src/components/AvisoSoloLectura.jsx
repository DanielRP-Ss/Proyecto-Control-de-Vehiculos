// Aviso para perfiles sin permiso de escritura. La interfaz no bloquea el envío:
// la decisión final es del backend (responde 403) y se muestra con <AlertError />.
export default function AvisoSoloLectura({ recurso }) {
  return (
    <div className="alert alert-warning">
      Su perfil es de solo lectura para {recurso}. Si intenta guardar, el servidor rechazará la
      operación (403).
    </div>
  );
}
