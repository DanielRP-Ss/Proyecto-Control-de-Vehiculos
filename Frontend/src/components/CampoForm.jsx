export default function CampoForm({ id, etiqueta, obligatorio = false, error, ayuda, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {etiqueta}
        {obligatorio && <span className="text-danger"> *</span>}
      </label>
      {children}
      {error && <div className="invalid-feedback">{error}</div>}
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
    </div>
  );
}
