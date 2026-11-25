import { Link, useParams } from "react-router-dom";
import AlertError from "../../components/AlertError";
import Loader from "../../components/Loader";
import { useConsulta } from "../../hooks/useConsulta";
import { obtenerVehiculo } from "../../services/vehiculosService";
import VehiculoFormulario from "./VehiculoFormulario";

const sinConsulta = async () => ({ ok: true, status: 200, datos: null });

// Rutas: /vehiculos/nuevo (crear) y /vehiculos/:id/editar (editar, precarga desde la API).
export default function VehiculoFormPage() {
  const { id } = useParams();
  const editando = Boolean(id);
  const { cargando, datos, error } = useConsulta(editando ? obtenerVehiculo : sinConsulta, id);

  let contenido;
  if (cargando) contenido = <Loader mensaje="Cargando vehículo..." />;
  else if (error) {
    contenido = (
      <>
        <AlertError error={error} />
        <Link to="/vehiculos" className="btn btn-outline-secondary">Volver al listado</Link>
      </>
    );
  } else contenido = <VehiculoFormulario key={id ?? "nuevo"} vehiculo={datos} />;

  return (
    <>
      <h4 className="mb-3">{editando ? "Editar vehículo" : "Nuevo vehículo"}</h4>
      {contenido}
    </>
  );
}
