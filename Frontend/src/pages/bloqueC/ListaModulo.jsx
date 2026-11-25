import { useState } from "react";
import { Link } from "react-router-dom";
import { useConsulta } from "../../hooks/useConsulta";
import { useParametrosURL } from "../../hooks/useParametrosURL";
import { useMensajeFlash } from "../../hooks/useMensajeFlash";

import AlertError from "../../components/AlertError";
import AlertSuccess from "../../components/AlertSuccess";
import ConfirmModal from "../../components/ConfirmModal";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";

export default function ListaModulo({
  titulo,
  ruta,
  claves,
  listar,
  eliminar,
  columnas,
  filtros,
  puedeCrear,
  puedeEditar,
  puedeEliminar,
  resumen,
  alCambiar
}) {
  const [params, actualizar] = useParametrosURL(claves);

  const { datos, error, cargando, recargar } =
    useConsulta(listar, params);

  const [exito, setExito] = useMensajeFlash();
  const [objetivo, setObjetivo] = useState(null);
  const [fallo, setFallo] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  async function borrar() {
    const id = objetivo.id;

    setObjetivo(null);
    setOcupado(true);
    setFallo(null);
    setExito("");

    const res = await eliminar(id);

    setOcupado(false);

    if (!res.ok) {
      setFallo(res);
      return;
    }

    setExito("Registro eliminado correctamente.");

    if (
      datos.resultados.length === 1 &&
      datos.pagina_actual > 1
    ) {
      actualizar({
        page: datos.pagina_actual - 1
      });
    } else {
      recargar();
    }

    alCambiar?.();
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{titulo}</h4>

        {puedeCrear && (
          <Link
            className="btn btn-primary"
            to={`${ruta}/nuevo`}
          >
            Nuevo
          </Link>
        )}
      </div>

      <AlertSuccess
        mensaje={exito}
        onCerrar={() => setExito("")}
      />

      <AlertError error={fallo} />

      {resumen}

      <div className="row g-2 mb-3">
        {filtros.map(f => (
          <div className="col-12 col-md" key={f.nombre}>
            <label
              className="form-label"
              htmlFor={f.nombre}
            >
              {f.etiqueta}
            </label>

            {f.opciones ? (
              <select
                id={f.nombre}
                className="form-select"
                value={params[f.nombre] || ""}
                onChange={e =>
                  actualizar({
                    [f.nombre]: e.target.value,
                    page: 1
                  })
                }
              >
                <option value="">Todos</option>

                {f.opciones.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={f.nombre}
                className="form-control"
                value={params[f.nombre] || ""}
                onChange={e =>
                  actualizar({
                    [f.nombre]: e.target.value,
                    page: 1
                  })
                }
              />
            )}
          </div>
        ))}
      </div>

      {cargando || ocupado ? (
        <Loader mensaje="Cargando..." />
      ) : error ? (
        <AlertError error={error} />
      ) : !datos?.resultados?.length ? (
        <EmptyState mensaje="No se encontraron registros." />
      ) : (
        <>
          <p className="text-muted">
            {datos.total_registros} registro(s)
          </p>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  {columnas.map(c => (
                    <th key={c.titulo}>{c.titulo}</th>
                  ))}

                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {datos.resultados.map(r => (
                  <tr key={r.id}>
                    {columnas.map(c => (
                      <td key={c.titulo}>{c.ver(r)}</td>
                    ))}

                    <td className="text-nowrap">
                      <Link
                        className="btn btn-sm btn-outline-secondary me-1"
                        to={`${ruta}/${r.id}`}
                      >
                        Ver
                      </Link>

                      {puedeEditar(r) && (
                        <Link
                          className="btn btn-sm btn-outline-primary me-1"
                          to={`${ruta}/${r.id}/editar`}
                        >
                          Editar
                        </Link>
                      )}

                      {puedeEliminar(r) && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setObjetivo(r)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            pagina={datos.pagina_actual}
            totalPaginas={datos.total_paginas}
            onCambiarPagina={page => actualizar({ page })}
          />
        </>
      )}

      {objetivo && (
        <ConfirmModal
          mensaje="¿Desea eliminar este registro?"
          onConfirmar={borrar}
          onCancelar={() => setObjetivo(null)}
        />
      )}
    </>
  );
}