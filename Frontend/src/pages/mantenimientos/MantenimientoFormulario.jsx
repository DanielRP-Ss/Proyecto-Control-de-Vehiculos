import { Link, useNavigate } from "react-router-dom";
import AlertError from "../../components/AlertError";
import AvisoSoloLectura from "../../components/AvisoSoloLectura";
import CampoForm from "../../components/CampoForm";
import { claseControl } from "../../utils/formularios";
import { useFormulario } from "../../hooks/useFormulario";
import { usePermisos } from "../../hooks/usePermisos";
import { actualizarMantenimiento, crearMantenimiento } from "../../services/mantenimientosService";
import { ESTADOS_MANTENIMIENTO } from "../../utils/constantes";
import { formatearKm } from "../../utils/formato";
import { CAMPOS_MANTENIMIENTO, validarMantenimiento } from "./validarMantenimiento";
const VACIO = {
  vehiculo: "",
  descripcion: "",
  kilometraje_objetivo: "",
  fecha_programada: "",
  estado: "PENDIENTE",
};
const desdeApi = (m) => ({
  vehiculo: String(m.vehiculo),
  descripcion: m.descripcion,
  kilometraje_objetivo: String(m.kilometraje_objetivo),
  fecha_programada: m.fecha_programada,
  estado: m.estado,
});
export default function MantenimientoFormulario({ mantenimiento, vehiculos, preseleccion = "" }) {
  const navigate = useNavigate();
  const { esAdmin } = usePermisos();
  const editando = Boolean(mantenimiento);
  const {
    valores, cambiar, errores, general, guardando,
    setGuardando, setErroresLocales, setErrorServidor,
  } = useFormulario({
    inicial: mantenimiento ? desdeApi(mantenimiento) : { ...VACIO, vehiculo: preseleccion },
    campos: CAMPOS_MANTENIMIENTO,
  });
  const vehiculoElegido = vehiculos.find((v) => String(v.id) === valores.vehiculo);
  const enviar = async (e) => {
    e.preventDefault();
    setErrorServidor(null);
    const encontrados = validarMantenimiento(valores, vehiculoElegido);
    setErroresLocales(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    const payload = {
      vehiculo: Number(valores.vehiculo),
      descripcion: valores.descripcion.trim(),
      kilometraje_objetivo: Number(valores.kilometraje_objetivo),
      fecha_programada: valores.fecha_programada,
      estado: valores.estado,
    };
    setGuardando(true);
    const res = editando
      ? await actualizarMantenimiento(mantenimiento.id, payload)
      : await crearMantenimiento(payload);
    setGuardando(false);
    if (res.ok) {
      navigate("/mantenimientos", {
        state: { exito: `Mantenimiento ${editando ? "actualizado" : "programado"} correctamente.` },
      });
    } else {
      setErrorServidor(res);
    }
  };
  return (
    <form onSubmit={enviar} noValidate className="card card-body" style={{ maxWidth: 640 }}>
      {!esAdmin && <AvisoSoloLectura recurso="mantenimientos" />}
      <AlertError error={general} />
      <CampoForm id="vehiculo" etiqueta="Vehículo" obligatorio error={errores.vehiculo}
        ayuda={vehiculoElegido ? `Kilometraje actual: ${formatearKm(vehiculoElegido.kilometraje)}` : undefined}>
        <select id="vehiculo" name="vehiculo" className={claseControl(errores.vehiculo, "form-select")}
          value={valores.vehiculo} onChange={cambiar}>
          <option value="">Seleccione un vehículo...</option>
          {vehiculos.map((v) => (
            <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo}</option>
          ))}
        </select>
      </CampoForm>
      <CampoForm id="descripcion" etiqueta="Descripción" obligatorio error={errores.descripcion}>
        <textarea id="descripcion" name="descripcion" rows={3} className={claseControl(errores.descripcion)}
          value={valores.descripcion} onChange={cambiar} />
      </CampoForm>
      <div className="row">
        <div className="col-md-6">
          <CampoForm id="kilometraje_objetivo" etiqueta="Kilometraje objetivo" obligatorio
            error={errores.kilometraje_objetivo} ayuda="Debe ser mayor al kilometraje actual del vehículo (RN-02).">
            <input id="kilometraje_objetivo" name="kilometraje_objetivo" type="number" min="1"
              className={claseControl(errores.kilometraje_objetivo)} value={valores.kilometraje_objetivo}
              onChange={cambiar} />
          </CampoForm>
        </div>
        <div className="col-md-6">
          <CampoForm id="fecha_programada" etiqueta="Fecha programada" obligatorio error={errores.fecha_programada}>
            <input id="fecha_programada" name="fecha_programada" type="date"
              className={claseControl(errores.fecha_programada)} value={valores.fecha_programada}
              onChange={cambiar} />
          </CampoForm>
        </div>
      </div>
      <CampoForm id="estado" etiqueta="Estado" obligatorio error={errores.estado}>
        <select id="estado" name="estado" className={claseControl(errores.estado, "form-select")}
          value={valores.estado} onChange={cambiar}>
          {ESTADOS_MANTENIMIENTO.map((e) => (
            <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
          ))}
        </select>
      </CampoForm>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Programar mantenimiento"}
        </button>
        <Link to="/mantenimientos" className="btn btn-outline-secondary">Cancelar</Link>
      </div>
    </form>
  );
}
