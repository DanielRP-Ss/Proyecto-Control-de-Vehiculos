import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useConsulta } from "../../hooks/useConsulta";
import { usePermisos } from "../../hooks/usePermisos";

import {
  obtenerOrden,
  listarConsumos
} from "../../services/ordenesService";

import {
  obtenerVehiculo
} from "../../services/vehiculosService";

import {
  listarTodosLosRepuestos
} from "../../services/inventarioService";

import {
  activa,
  dinero,
  fecha,
  sinConsulta
} from "../bloqueC/compartido";

import AlertError from "../../components/AlertError";
import AlertSuccess from "../../components/AlertSuccess";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import ConsumoFormulario from "./ConsumoFormulario";

export default function OrdenDetalle() {
  const { id } = useParams();
  const { roles, esAdmin } = usePermisos();

  const [page, setPage] = useState(1);
  const [exito, setExito] = useState("");

  const o = useConsulta(obtenerOrden, id);

  const v = useConsulta(
    o.datos ? obtenerVehiculo : sinConsulta,
    o.datos?.vehiculo
  );

  const params = useMemo(
    () => ({ orden: id, page }),
    [id, page]
  );

  const c = useConsulta(listarConsumos, params);
  const r = useConsulta(listarTodosLosRepuestos);

  if (o.cargando) return <Loader />;

  if (o.error) return <AlertError error={o.error} />;

  const d = o.datos;

  return (
    <>
      <h4>Orden {d.codigo}</h4>

      <AlertSuccess
        mensaje={exito}
        onCerrar={() => setExito("")}
      />

      <AlertError error={v.error} />
      <AlertError error={r.error} />

      <div className="card card-body mb-3">
        <p>Vehículo: {v.datos?.placa || d.vehiculo}</p>
        <p>Mecánico: {d.mecanico ?? "Sin asignar"}</p>
        <p>Estado: {d.estado}</p>
        <p>Falla: {d.descripcion_falla}</p>
        <p>Ingreso: {fecha(d.fecha_ingreso)}</p>
        <p>Salida: {fecha(d.fecha_salida)}</p>

        <strong>
          Costo total: {dinero(d.costo_total)}
        </strong>
      </div>

      {activa(d) &&
        (esAdmin || roles.includes("Operador")) && (
          <ConsumoFormulario
            orden={d}
            onExito={mensaje => {
              setExito(mensaje);
              setPage(1);
              o.recargar();
              c.recargar();
              r.recargar();
            }}
          />
        )}

      <h5>Historial de consumos</h5>

      {c.cargando ? (
        <Loader />
      ) : c.error ? (
        <AlertError error={c.error} />
      ) : !c.datos?.resultados?.length ? (
        <EmptyState mensaje="No hay consumos registrados." />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Repuesto</th>
                  <th>Cantidad</th>
                  <th>Precio aplicado</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {c.datos.resultados.map(x => (
                  <tr key={x.id}>
                    <td>
                      {r.datos?.find(
                        p => p.id === x.repuesto
                      )?.nombre || x.repuesto}
                    </td>

                    <td>{x.cantidad_utilizada}</td>

                    <td>
                      {dinero(x.precio_unitario_aplicado)}
                    </td>

                    <td>{dinero(x.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            pagina={c.datos.pagina_actual}
            totalPaginas={c.datos.total_paginas}
            onCambiarPagina={setPage}
          />
        </>
      )}

      <Link
        className="btn btn-outline-secondary"
        to="/ordenes"
      >
        Volver
      </Link>
    </>
  );
}