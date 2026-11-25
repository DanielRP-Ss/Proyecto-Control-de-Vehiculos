import { useState } from "react";
import { separarErrores } from "../utils/errores";
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
