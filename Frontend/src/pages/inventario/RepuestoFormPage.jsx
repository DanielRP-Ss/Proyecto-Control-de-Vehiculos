import { useParams } from "react-router-dom";
import { useConsulta } from "../../hooks/useConsulta";
import { obtenerRepuesto } from "../../services/inventarioService";
import {
  listarTodosLosProveedores,
  sinConsulta
} from "../bloqueC/compartido";
import Loader from "../../components/Loader";
import AlertError from "../../components/AlertError";
import RepuestoFormulario from "./RepuestoFormulario";
export default function RepuestoFormPage() {
  const { id } = useParams();
  const r = useConsulta(
    id ? obtenerRepuesto : sinConsulta,
    id
  );
  const p = useConsulta(listarTodosLosProveedores);
  return (
    <>
      <h4>{id ? "Editar repuesto" : "Nuevo repuesto"}</h4>
      {r.cargando || p.cargando ? (
        <Loader />
      ) : r.error || p.error ? (
        <AlertError error={r.error || p.error} />
      ) : (
        <RepuestoFormulario
          key={id || "nuevo"}
          repuesto={r.datos}
          proveedores={p.datos}
        />
      )}
    </>
  );
}
