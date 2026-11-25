import { useParams } from "react-router-dom";
import { useConsulta } from "../../hooks/useConsulta";
import { obtenerOrden } from "../../services/ordenesService";
import { listarTodosLosVehiculos } from "../../services/vehiculosService";
import { sinConsulta } from "../bloqueC/compartido";
import Loader from "../../components/Loader";
import AlertError from "../../components/AlertError";
import OrdenFormulario from "./OrdenFormulario";

export default function OrdenFormPage() {
  const { id } = useParams();

  const o = useConsulta(
    id ? obtenerOrden : sinConsulta,
    id
  );

  const v = useConsulta(listarTodosLosVehiculos);

  return (
    <>
      <h4>{id ? "Editar orden" : "Nueva orden"}</h4>

      {o.cargando || v.cargando ? (
        <Loader />
      ) : o.error || v.error ? (
        <AlertError error={o.error || v.error} />
      ) : (
        <OrdenFormulario
          key={id || "nuevo"}
          orden={o.datos}
          vehiculos={v.datos}
        />
      )}
    </>
  );
}