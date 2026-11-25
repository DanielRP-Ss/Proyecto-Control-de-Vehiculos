// Clase Bootstrap de un control de formulario: agrega "is-invalid" cuando hay error.
export const claseControl = (error, base = "form-control") =>
  `${base}${error ? " is-invalid" : ""}`;
