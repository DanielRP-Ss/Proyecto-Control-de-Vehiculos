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
import { eliminarProveedor, listarProveedores } from "../../services/proveedoresService";
import BuscadorProveedores from "./BuscadorProveedores";
import TablaProveedores from "./TablaProveedores";
const CLAVES_URL = ["buscar", "page"];
export default function ProveedoresLista() {
  const { esAdmin } = usePermisos();
  const [parametros, actualizar] = useParametrosURL(CLAVES_URL);
  const { cargando, datos, error, recargar } = useConsulta(listarProveedores, parametros);
  const [exito, setExito] = useMensajeFlash();
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorBorrado, setErrorBorrado] = useState(null);
  const confirmarEliminar = async () => {
    const proveedor = aEliminar;
    setAEliminar(null);
    setEliminando(true);
    setErrorBorrado(null);
    setExito("");
    const res = await eliminarProveedor(proveedor.id);
    setEliminando(false);
    if (!res.ok) {
      setErrorBorrado(res);
      return;
    }
    setExito(`Proveedor ${proveedor.nombre} eliminado correctamente.`);
    if (datos.resultados.length === 1 && datos.pagina_actual > 1) {
      actualizar({ page: datos.pagina_actual - 1 });
    } else {
      recargar();
    }
  };
  let contenido;
  if (cargando || eliminando) {
    contenido = <Loader mensaje="Cargando proveedores..." />;
  } else if (error) {
    contenido = <AlertError error={error} />;
  } else if (datos.resultados.length === 0) {
    contenido = <EmptyState mensaje="No se encontraron proveedores." />;
  } else {
    contenido = (
      <>
        <p className="text-muted small mb-2">{datos.total_registros} proveedor(es) encontrado(s)</p>
        <TablaProveedores proveedores={datos.resultados} esAdmin={esAdmin} onEliminar={setAEliminar} />
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
        <h4 className="mb-0">Proveedores</h4>
        {esAdmin ? (
          <Link to="/proveedores/nuevo" className="btn btn-primary">+ Nuevo proveedor</Link>
        ) : (
          <span className="badge text-bg-secondary">Solo lectura</span>
        )}
      </div>
      <AlertSuccess mensaje={exito} onCerrar={() => setExito("")} />
      <AlertError error={errorBorrado} />
      <BuscadorProveedores key={parametros.buscar ?? ""} inicial={parametros.buscar} onBuscar={actualizar} />
      {contenido}
      {aEliminar && (
        <ConfirmModal
          mensaje={`¿Eliminar al proveedor ${aEliminar.nombre}? Si tiene repuestos asociados, el servidor no permitirá borrarlo.`}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
        />
      )}
    </>
  );
}
