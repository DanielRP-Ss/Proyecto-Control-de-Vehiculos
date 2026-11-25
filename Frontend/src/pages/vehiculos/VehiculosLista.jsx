import { useState } from "react";
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
import { eliminarVehiculo, listarVehiculos } from "../../services/vehiculosService";
import FiltrosVehiculos from "./FiltrosVehiculos";
import TablaVehiculos from "./TablaVehiculos";
const CLAVES_URL = ["estado", "kilometraje_min", "kilometraje_max", "page"];
export default function VehiculosLista() {
  const { esAdmin } = usePermisos();
  const [parametros, actualizar] = useParametrosURL(CLAVES_URL);
  const { cargando, datos, error, recargar } = useConsulta(listarVehiculos, parametros);
  const [exito, setExito] = useMensajeFlash();
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorBorrado, setErrorBorrado] = useState(null);
  const confirmarEliminar = async () => {
    const vehiculo = aEliminar;
    setAEliminar(null);
    setEliminando(true);
    setErrorBorrado(null);
    setExito("");
    const res = await eliminarVehiculo(vehiculo.id);
    setEliminando(false);
    if (!res.ok) {
      setErrorBorrado(res);
      return;
    }
    setExito(`Vehículo ${vehiculo.placa} eliminado correctamente.`);
    if (datos.resultados.length === 1 && datos.pagina_actual > 1) {
      actualizar({ page: datos.pagina_actual - 1 });
    } else {
      recargar();
    }
  };
  let contenido;
  if (cargando || eliminando) {
    contenido = <Loader mensaje="Cargando vehículos..." />;
  } else if (error) {
    contenido = <AlertError error={error} />;
  } else if (datos.resultados.length === 0) {
    contenido = <EmptyState mensaje="No hay vehículos que coincidan con los filtros." />;
  } else {
    contenido = (
      <>
        <p className="text-muted small mb-2">{datos.total_registros} vehículo(s) encontrado(s)</p>
        <TablaVehiculos vehiculos={datos.resultados} esAdmin={esAdmin} onEliminar={setAEliminar} />
        <Pagination
          pagina={datos.pagina_actual}
          totalPaginas={datos.total_paginas}
          onCambiarPagina={(p) => actualizar({ page: p })}
        />
      </>
    );
  }
  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h4 className="mb-0">Vehículos</h4>
        {esAdmin ? (
          <Link to="/vehiculos/nuevo" className="btn btn-primary">+ Nuevo vehículo</Link>
        ) : (
          <span className="badge text-bg-secondary">Solo lectura</span>
        )}
      </div>
      <AlertSuccess mensaje={exito} onCerrar={() => setExito("")} />
      <AlertError error={errorBorrado} />
      <FiltrosVehiculos key={JSON.stringify(parametros)} inicial={parametros} onAplicar={actualizar} />
      {contenido}
      {aEliminar && (
        <ConfirmModal
          mensaje={`¿Eliminar el vehículo ${aEliminar.placa}? También se eliminarán sus mantenimientos programados. Si tiene órdenes de trabajo, el servidor no permitirá borrarlo.`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
        />
      )}
    </>
  );
}
