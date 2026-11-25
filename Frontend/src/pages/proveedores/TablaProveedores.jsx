import { Link } from "react-router-dom";
export default function TablaProveedores({ proveedores, esAdmin, onEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Cédula jurídica</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((p) => (
            <tr key={p.id}>
              <td>{p.cedula_juridica}</td>
              <td className="fw-semibold">{p.nombre}</td>
              <td>{p.contacto}</td>
              <td className="text-end text-nowrap">
                {esAdmin && (
                  <>
                    <Link to={`/proveedores/${p.id}/editar`} className="btn btn-sm btn-outline-primary me-1">
                      Editar
                    </Link>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(p)}>
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
