import { Link } from "react-router-dom";
import BadgeEstado from "../../components/BadgeEstado";
import { ESTADOS_VEHICULO } from "../../utils/constantes";
import { formatearKm } from "../../utils/formato";

export default function TablaVehiculos({ vehiculos, esAdmin, onEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th className="text-end">Kilometraje</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id}>
              <td className="fw-semibold">{v.placa}</td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.anio}</td>
              <td className="text-end">{formatearKm(v.kilometraje)}</td>
              <td><BadgeEstado estado={v.estado} opciones={ESTADOS_VEHICULO} /></td>
              <td className="text-end text-nowrap">
                <Link to={`/mantenimientos?vehiculo=${v.id}`} className="btn btn-sm btn-outline-secondary me-1">
                  Mantenimientos
                </Link>
                {esAdmin && (
                  <>
                    <Link to={`/vehiculos/${v.id}/editar`} className="btn btn-sm btn-outline-primary me-1">
                      Editar
                    </Link>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(v)}>
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
