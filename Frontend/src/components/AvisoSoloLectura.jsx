export default function AvisoSoloLectura({ recurso }) {
  return (
    <div className="alert alert-warning">
      Su perfil es de solo lectura para {recurso}. Si intenta guardar, el servidor rechazará la
      operación (403).
    </div>
  );
}
