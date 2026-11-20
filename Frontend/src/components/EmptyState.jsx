export default function EmptyState({ mensaje = "No hay registros para mostrar." }) {
  return (
    <div className="alert alert-light border text-center text-muted my-3">
      {mensaje}
    </div>
  );
}