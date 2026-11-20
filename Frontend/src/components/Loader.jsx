export default function Loader({ mensaje = "Cargando..." }) {
  return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status" />
      <p className="text-muted mt-2 mb-0">{mensaje}</p>
    </div>
  );
}