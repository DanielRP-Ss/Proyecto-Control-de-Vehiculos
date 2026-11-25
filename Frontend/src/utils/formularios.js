export const claseControl = (error, base = "form-control") =>
  `${base}${error ? " is-invalid" : ""}`;
