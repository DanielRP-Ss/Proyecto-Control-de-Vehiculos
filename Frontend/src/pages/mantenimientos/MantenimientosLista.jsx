import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AlertError from "../../components/AlertError";
import AlertSuccess from "../../components/AlertSuccess";
import ConfirmModal from "../../components/ConfirmModal";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import { useConsulta } from "../../hooks/useConsulta";
import { useMensajeFlash } from "../../hooks/useMensajeFlash";
import { useParametrosURL } from "../../hooks/useParametrosURL";
import { usePermisos } from "../../hooks/usePermisos";
import { eliminarMantenimiento, listarMantenimientos } from "../../services/mantenimientosService";
import { listarTodosLosVehiculos } from "../../services/vehiculosService";
import { formatearFecha } from "../../utils/formato";
import FiltrosMantenimientos from "./FiltrosMantenimientos";
import TablaMantenimientos from "./TablaMantenimientos";

const CLAVES_URL = ["estado", "vehiculo", "page"];
const SIN_PARAMETROS = {};

export default function MantenimientosLista() {
  const { esAdmin } = usePermisos();
  const [parametros, actualizar] = useParametrosURL(CLAVES_URL);

  // El filtro `vehiculo` debe ser un id numérico (evita enviar basura al backend desde la URL).
  const parametrosConsulta = useMemo(() => {
    const { vehiculo, ...resto } = parametros;
    return /^\d+$/.test(vehiculo ?? "") ? { ...resto, vehiculo } : resto;
  }, [parametros]);

  const lista = useConsulta(listarMantenimientos, parametrosConsulta);
  const catalogo = useConsulta(listarTodosLosVehiculos, SIN_PARAMETROS);

  const vehiculos = catalogo.datos;
  const vehiculosPorId = useMemo(() => new Map((vehiculos ?? []).map((v) => [v.id, v])), [vehiculos]);

  const [exito, setExito] = useMensajeFlash();
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorBorrado, setErrorBorrado] = useState(null);

  const confirmarEliminar = async () => {
    const mantenimiento = aEliminar;
    setAEliminar(null);
    setEliminando(true);
    setErrorBorrado(null);
    setExito("");
    const res = await eliminarMantenimiento(mantenimiento.id);
    setEliminando(false);
    if (!res.ok) {
      setErrorBorrado(res);
      return;
    }
    setExito("Mantenimiento eliminado correctamente.");
    if (lista.datos.resultados.length === 1 && lista.datos.pagina_actual > 1) {
      actualizar({ page: lista.datos.pagina_actual - 1 });
    } else {
      lista.recargar();
    }
  };

  let contenido;
  if (lista.cargando || eliminando) {
    contenido = <Loader mensaje="Cargando mantenimientos..." />;
  } else if (lista.error) {
    contenido = <AlertError error={lista.error} />;
  } else if (lista.datos.resultados.length === 0) {
    contenido = <EmptyState mensaje="No hay mantenimientos que coincidan con los filtros." />;
  } else {
    contenido = (
      <>
        <p className="text-muted small mb-2">{lista.datos.total_registros} mantenimiento(s) encontrado(s)</p>
        <TablaMantenimientos
          mantenimientos={lista.datos.resultados}
          vehiculosPorId={vehiculosPorId}
          esAdmin={esAdmin}
          onEliminar={setAEliminar}
        />
        <Pagination
          pagina={lista.datos.pagina_actual}
          totalPaginas={lista.datos.total_paginas}
          onCambiarPagina={(p) => actualizar({ page: p })}
        />
      </>
    );
  }

  const placaEliminar = aEliminar ? vehiculosPorId.get(aEliminar.vehiculo)?.placa ?? `#${aEliminar.vehiculo}` : "";

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h4 className="mb-0">Mantenimientos</h4>
        {esAdmin ? (
          <Link to="/mantenimientos/nuevo" className="btn btn-primary">+ Programar mantenimiento</Link>
        ) : (
          <span className="badge text-bg-secondary">Solo lectura</span>
        )}
      </div>

      <AlertSuccess mensaje={exito} onCerrar={() => setExito("")} />
      <AlertError error={errorBorrado} />
      {catalogo.error && <AlertError error={catalogo.error} />}

      <FiltrosMantenimientos
        key={JSON.stringify(parametros)}
        inicial={parametros}
        vehiculos={vehiculos ?? []}
        onAplicar={actualizar}
      />

      {contenido}

      {aEliminar && (
        <ConfirmModal
          mensaje={`¿Eliminar el mantenimiento programado para ${placaEliminar} el ${formatearFecha(aEliminar.fecha_programada)}?`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
        />
      )}
    </>
  );
}
