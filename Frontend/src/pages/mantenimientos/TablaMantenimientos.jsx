import { Link } from "react-router-dom";
import BadgeEstado from "../../components/BadgeEstado";
import { ESTADOS_MANTENIMIENTO } from "../../utils/constantes";
import { formatearFecha, formatearKm } from "../../utils/formato";

// `vehiculosPorId` (Map) permite mostrar la placa en lugar del id de la relación.
export default function TablaMantenimientos({ mantenimientos, vehiculosPorId, esAdmin, onEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Vehículo</th>
            <th>Descripción</th>
            <th className="text-end">Km objetivo</th>
            <th>Fecha programada</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mantenimientos.map((m) => {
            const vehiculo = vehiculosPorId.get(m.vehiculo);
            return (
              <tr key={m.id}>
                <td>
                  <div className="fw-semibold">{vehiculo ? vehiculo.placa : `Vehículo #${m.vehiculo}`}</div>
                  {vehiculo && (
                    <small className="text-muted">
                      {vehiculo.marca} {vehiculo.modelo} · actual {formatearKm(vehiculo.kilometraje)}
                    </small>
                  )}
                </td>
                <td style={{ maxWidth: 280 }} className="text-truncate" title={m.descripcion}>{m.descripcion}</td>
                <td className="text-end">{formatearKm(m.kilometraje_objetivo)}</td>
                <td>{formatearFecha(m.fecha_programada)}</td>
                <td><BadgeEstado estado={m.estado} opciones={ESTADOS_MANTENIMIENTO} /></td>
                <td className="text-end text-nowrap">
                  {esAdmin && (
                    <>
                      <Link to={`/mantenimientos/${m.id}/editar`} className="btn btn-sm btn-outline-primary me-1">
                        Editar
                      </Link>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(m)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
