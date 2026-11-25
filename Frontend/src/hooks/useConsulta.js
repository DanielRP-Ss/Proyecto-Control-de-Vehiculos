import { useCallback, useEffect, useState } from "react";
export function useConsulta(consultar, parametros) {
  const [version, setVersion] = useState(0);
  const [estado, setEstado] = useState({ parametros: null, version: -1, res: null });
  useEffect(() => {
    let activo = true;
    consultar(parametros).then((res) => {
      if (activo) setEstado({ parametros, version, res });
    });
    return () => {
      activo = false;
    };
  }, [consultar, parametros, version]);
  const cargando = estado.parametros !== parametros || estado.version !== version;
  const res = cargando ? null : estado.res;
  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  return {
    cargando,
    datos: res && res.ok ? res.datos : null,
    error: res && !res.ok ? res : null,
    recargar,
  };
}
