import CampoForm from "../../components/CampoForm";
export default function Campo({
  nombre,
  etiqueta,
  form,
  opciones,
  tipo = "text",
  obligatorio = true,
  ...props
}) {
  const error = form.errores[nombre];
  const comun = {
    id: nombre,
    name: nombre,
    value: form.valores[nombre] ?? "",
    onChange: form.cambiar,
    required: obligatorio,
    ...props
  };
  return (
    <CampoForm
      id={nombre}
      etiqueta={etiqueta}
      obligatorio={obligatorio}
      error={error}
    >
      {opciones ? (
        <select
          {...comun}
          className={`form-select ${error ? "is-invalid" : ""}`}
        >
          <option value="">Seleccione...</option>
          {opciones.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : tipo === "textarea" ? (
        <textarea
          {...comun}
          className={`form-control ${error ? "is-invalid" : ""}`}
        />
      ) : (
        <input
          {...comun}
          type={tipo}
          className={`form-control ${error ? "is-invalid" : ""}`}
        />
      )}
    </CampoForm>
  );
}
