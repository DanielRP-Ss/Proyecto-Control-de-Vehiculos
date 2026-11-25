import { Link, useParams } from "react-router-dom";
import { useConsulta } from "../../hooks/useConsulta";
import { obtenerRepuesto } from "../../services/inventarioService";
import { obtenerProveedor } from "../../services/proveedoresService";
import { dinero, sinConsulta } from "../bloqueC/compartido";
import AlertError from "../../components/AlertError";
import Loader from "../../components/Loader";

export default function RepuestoDetalle() {
  const { id } = useParams();

  const r = useConsulta(obtenerRepuesto, id);

  const p = useConsulta(
    r.datos ? obtenerProveedor : sinConsulta,
    r.datos?.proveedor
  );

  if (r.cargando || p.cargando) return <Loader />;

  if (r.error) return <AlertError error={r.error} />;

  const d = r.datos;

  return (
    <>
      <h4>{d.nombre}</h4>

      <AlertError error={p.error} />

      <div className="card card-body">
        <p>Código: {d.codigo}</p>
        <p>Stock: {d.stock}</p>
        <p>Stock mínimo: {d.stock_minimo}</p>
        <p>Precio: {dinero(d.precio_unitario)}</p>
        <p>Proveedor: {p.datos?.nombre || d.proveedor}</p>
      </div>

      <Link
        className="btn btn-outline-secondary mt-3"
        to="/inventario"
      >
        Volver
      </Link>
    </>
  );
}