import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
export function useParametrosURL(claves) {
  const [searchParams, setSearchParams] = useSearchParams();
  const parametros = useMemo(() => {
    const resultado = {};
    claves.forEach((clave) => {
      const valor = searchParams.get(clave);
      if (valor) resultado[clave] = valor;
    });
    return resultado;
  }, [searchParams, claves]);
  const actualizar = useCallback(
    (cambios) => {
      setSearchParams((previos) => {
        const siguiente = new URLSearchParams(previos);
        Object.entries(cambios).forEach(([clave, valor]) => {
          const texto = valor === null || valor === undefined ? "" : String(valor).trim();
          if (texto === "" || (clave === "page" && texto === "1")) siguiente.delete(clave);
          else siguiente.set(clave, texto);
        });
        return siguiente;
      });
    },
    [setSearchParams]
  );
  return [parametros, actualizar];
}
