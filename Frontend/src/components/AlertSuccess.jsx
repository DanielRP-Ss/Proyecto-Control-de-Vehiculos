export default function AlertSuccess({ mensaje, onCerrar }) {
  if (!mensaje) return null;
  return (
    <div className="alert alert-success alert-dismissible" role="status">
      {mensaje}
      <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />
    </div>
  );
}
