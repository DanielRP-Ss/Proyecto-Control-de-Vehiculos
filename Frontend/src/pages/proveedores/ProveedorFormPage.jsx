import { Link, useParams } from "react-router-dom";
import AlertError from "../../components/AlertError";
import Loader from "../../components/Loader";
import { useConsulta } from "../../hooks/useConsulta";
import { obtenerProveedor } from "../../services/proveedoresService";
import ProveedorFormulario from "./ProveedorFormulario";

const sinConsulta = async () => ({ ok: true, status: 200, datos: null });

// Rutas: /proveedores/nuevo y /proveedores/:id/editar
export default function ProveedorFormPage() {
  const { id } = useParams();
  const editando = Boolean(id);
  const { cargando, datos, error } = useConsulta(editando ? obtenerProveedor : sinConsulta, id);

  let contenido;
  if (cargando) contenido = <Loader mensaje="Cargando proveedor..." />;
  else if (error) {
    contenido = (
      <>
        <AlertError error={error} />
        <Link to="/proveedores" className="btn btn-outline-secondary">Volver al listado</Link>
      </>
    );
  } else contenido = <ProveedorFormulario key={id ?? "nuevo"} proveedor={datos} />;

  return (
    <>
      <h4 className="mb-3">{editando ? "Editar proveedor" : "Nuevo proveedor"}</h4>
      {contenido}
    </>
  );
}
