import { Link, useNavigate } from "react-router-dom";
import { useFormulario } from "../../hooks/useFormulario";
import { usePermisos } from "../../hooks/usePermisos";
import {
  crearOrden,
  actualizarOrden
} from "../../services/ordenesService";
import {
  activa,
  estados,
  fechaLocal
} from "../bloqueC/compartido";
import Campo from "../bloqueC/Campo";
import AlertError from "../../components/AlertError";
const VACIO = {
  vehiculo: "",
  mecanico: "",
  estado: "ABIERTA",
  descripcion_falla: "",
  fecha_salida: ""
};
export default function OrdenFormulario({
  orden,
  vehiculos
}) {
  const navigate = useNavigate();
  const { esAdmin, roles } = usePermisos();
  const permite =
    (esAdmin || roles.includes("Operador")) &&
    (!orden || activa(orden));
  const form = useFormulario({
    inicial: orden
      ? {
          ...orden,
          mecanico: orden.mecanico ?? "",
          fecha_salida: fechaLocal(orden.fecha_salida)
        }
      : VACIO,
    campos: Object.keys(VACIO)
  });
  async function enviar(e) {
    e.preventDefault();
    if (!permite || form.guardando) return;
    const v = form.valores;
    const errores = {};
    if (!v.vehiculo) {
      errores.vehiculo = "Seleccione vehículo";
    }
    if (!v.descripcion_falla.trim()) {
      errores.descripcion_falla = "Describa la falla";
    }
    if (v.estado === "COMPLETADA" && !v.fecha_salida) {
      errores.fecha_salida = "Registre fecha de salida";
    }
    if (
      orden &&
      v.fecha_salida &&
      new Date(v.fecha_salida) < new Date(orden.fecha_ingreso)
    ) {
      errores.fecha_salida =
        "No puede ser anterior al ingreso";
    }
    form.setErroresLocales(errores);
    form.setErrorServidor(null);
    if (Object.keys(errores).length) return;
    const payload = {
      vehiculo: Number(v.vehiculo),
      mecanico: v.mecanico ? Number(v.mecanico) : null,
      estado: v.estado,
      descripcion_falla: v.descripcion_falla.trim(),
      fecha_salida: v.fecha_salida
        ? new Date(v.fecha_salida).toISOString()
        : null
    };
    form.setGuardando(true);
    const res = await (
      orden
        ? actualizarOrden(orden.id, payload)
        : crearOrden(payload)
    );
    form.setGuardando(false);
    if (res.ok) {
      navigate("/ordenes", {
        state: {
          exito: "Orden guardada correctamente."
        }
      });
    } else {
      form.setErrorServidor(res);
    }
  }
  return (
    <form
      className="card card-body"
      style={{ maxWidth: 640 }}
      onSubmit={enviar}
    >
      <AlertError error={form.general} />
      {!permite && (
        <p className="alert alert-warning">
          No puede modificar esta orden.
        </p>
      )}
      <Campo
        form={form}
        nombre="vehiculo"
        etiqueta="Vehículo"
        opciones={vehiculos.map(v => ({
          value: v.id,
          label: v.placa
        }))}
        disabled={!!orden}
      />
      <Campo
        form={form}
        nombre="mecanico"
        etiqueta="ID de mecánico (opcional)"
        tipo="number"
        min="1"
        step="1"
        obligatorio={false}
      />
      <Campo
        form={form}
        nombre="descripcion_falla"
        etiqueta="Descripción de falla"
        tipo="textarea"
      />
      <Campo
        form={form}
        nombre="estado"
        etiqueta="Estado"
        opciones={estados.map(s => ({
          value: s,
          label: s
        }))}
      />
      <Campo
        form={form}
        nombre="fecha_salida"
        etiqueta="Fecha de salida"
        tipo="datetime-local"
        obligatorio={form.valores.estado === "COMPLETADA"}
      />
      <div className="d-flex gap-2">
        <button
          className="btn btn-primary"
          disabled={!permite || form.guardando}
        >
          Guardar
        </button>
        <Link
          className="btn btn-outline-secondary"
          to="/ordenes"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
