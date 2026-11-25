import { useState } from "react";
import { separarErrores } from "../utils/errores";

// Estado común de los formularios controlados:
//   valores, cambiar(e)        -> campos controlados (con normalización opcional por campo)
//   errores                    -> errores por campo (validación local + 400 del servidor)
//   general                    -> error para <AlertError /> (401/403/404/409/500/red)
//   guardando                  -> true mientras se espera la respuesta de la API
// Al editar un campo se limpia su error, para no mostrar mensajes ya corregidos.
export function useFormulario({ inicial, campos, normalizar = {} }) {
  const [valores, setValores] = useState(inicial);
  const [erroresLocales, setErroresLocales] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const { porCampo, general } = separarErrores(errorServidor, campos);
  const errores = { ...porCampo, ...erroresLocales };

  const limpiarCampo = (nombre) => {
    setErroresLocales((previos) => {
      if (!(nombre in previos)) return previos;
      const copia = { ...previos };
      delete copia[nombre];
      return copia;
    });
    setErrorServidor((previo) => {
      if (!previo || previo.status !== 400 || !previo.datos || !(nombre in previo.datos)) return previo;
      const datos = { ...previo.datos };
      delete datos[nombre];
      return { ...previo, datos };
    });
  };

  const cambiar = (e) => {
    const { name, value } = e.target;
    const nuevo = normalizar[name] ? normalizar[name](value) : value;
    setValores((previos) => ({ ...previos, [name]: nuevo }));
    limpiarCampo(name);
  };

  return {
    valores,
    cambiar,
    errores,
    general,
    guardando,
    setGuardando,
    setErroresLocales,
    setErrorServidor,
  };
}
