import { Link, useParams, useSearchParams } from "react-router-dom";
import AlertError from "../../components/AlertError";
import Loader from "../../components/Loader";
import { useConsulta } from "../../hooks/useConsulta";
import { obtenerMantenimiento } from "../../services/mantenimientosService";
import { listarTodosLosVehiculos } from "../../services/vehiculosService";
import MantenimientoFormulario from "./MantenimientoFormulario";

const sinConsulta = async () => ({ ok: true, status: 200, datos: null });
const SIN_PARAMETROS = {};

// Rutas: /mantenimientos/nuevo y /mantenimientos/:id/editar
// Necesita dos consultas: el catálogo de vehículos (selector) y, al editar, el mantenimiento.
export default function MantenimientoFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editando = Boolean(id);

  const catalogo = useConsulta(listarTodosLosVehiculos, SIN_PARAMETROS);
  const registro = useConsulta(editando ? obtenerMantenimiento : sinConsulta, id);

  const preseleccion = /^\d+$/.test(searchParams.get("vehiculo") ?? "") ? searchParams.get("vehiculo") : "";
  const error = catalogo.error || registro.error;

  let contenido;
  if (catalogo.cargando || registro.cargando) contenido = <Loader mensaje="Cargando datos..." />;
  else if (error) {
    contenido = (
      <>
        <AlertError error={error} />
        <Link to="/mantenimientos" className="btn btn-outline-secondary">Volver al listado</Link>
      </>
    );
  } else {
    contenido = (
      <MantenimientoFormulario
        key={id ?? "nuevo"}
        mantenimiento={registro.datos}
        vehiculos={catalogo.datos}
        preseleccion={preseleccion}
      />
    );
  }

  return (
    <>
      <h4 className="mb-3">{editando ? "Editar mantenimiento" : "Programar mantenimiento"}</h4>
      {contenido}
    </>
  );
}
