import { Link, useNavigate } from "react-router-dom";
import AlertError from "../../components/AlertError";
import AvisoSoloLectura from "../../components/AvisoSoloLectura";
import CampoForm from "../../components/CampoForm";
import { claseControl } from "../../utils/formularios";
import { useFormulario } from "../../hooks/useFormulario";
import { usePermisos } from "../../hooks/usePermisos";
import { actualizarVehiculo, crearVehiculo } from "../../services/vehiculosService";
import { ESTADOS_VEHICULO } from "../../utils/constantes";
import { CAMPOS_VEHICULO, validarVehiculo } from "./validarVehiculo";
const VACIO = { placa: "", marca: "", modelo: "", anio: "", kilometraje: "0", estado: "ACTIVO" };
const desdeApi = (v) => ({
  placa: v.placa,
  marca: v.marca,
  modelo: v.modelo,
  anio: String(v.anio),
  kilometraje: String(v.kilometraje),
  estado: v.estado,
});
export default function VehiculoFormulario({ vehiculo }) {
  const navigate = useNavigate();
  const { esAdmin } = usePermisos();
  const editando = Boolean(vehiculo);
  const {
    valores, cambiar, errores, general, guardando,
    setGuardando, setErroresLocales, setErrorServidor,
  } = useFormulario({
    inicial: vehiculo ? desdeApi(vehiculo) : VACIO,
    campos: CAMPOS_VEHICULO,
    normalizar: { placa: (valor) => valor.toUpperCase().replace(/\s/g, "") },
  });
  const enviar = async (e) => {
    e.preventDefault();
    setErrorServidor(null);
    const encontrados = validarVehiculo(valores);
    setErroresLocales(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    const payload = {
      placa: valores.placa.trim().toUpperCase(),
      marca: valores.marca.trim(),
      modelo: valores.modelo.trim(),
      anio: Number(valores.anio),
      kilometraje: Number(valores.kilometraje),
      estado: valores.estado,
    };
    setGuardando(true);
    const res = editando ? await actualizarVehiculo(vehiculo.id, payload) : await crearVehiculo(payload);
    setGuardando(false);
    if (res.ok) {
      navigate("/vehiculos", {
        state: { exito: `Vehículo ${res.datos.placa} ${editando ? "actualizado" : "creado"} correctamente.` },
      });
    } else {
      setErrorServidor(res);
    }
  };
  return (
    <form onSubmit={enviar} noValidate className="card card-body" style={{ maxWidth: 640 }}>
      {!esAdmin && <AvisoSoloLectura recurso="vehículos" />}
      <AlertError error={general} />
      <CampoForm id="placa" etiqueta="Placa" obligatorio error={errores.placa}
        ayuda="Se guarda en mayúsculas y sin espacios (RN-01). Debe ser única.">
        <input id="placa" name="placa" className={claseControl(errores.placa)} value={valores.placa}
          onChange={cambiar} maxLength={15} autoComplete="off" />
      </CampoForm>
      <div className="row">
        <div className="col-md-6">
          <CampoForm id="marca" etiqueta="Marca" obligatorio error={errores.marca}>
            <input id="marca" name="marca" className={claseControl(errores.marca)} value={valores.marca}
              onChange={cambiar} maxLength={50} />
          </CampoForm>
        </div>
        <div className="col-md-6">
          <CampoForm id="modelo" etiqueta="Modelo" obligatorio error={errores.modelo}>
            <input id="modelo" name="modelo" className={claseControl(errores.modelo)} value={valores.modelo}
              onChange={cambiar} maxLength={50} />
          </CampoForm>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <CampoForm id="anio" etiqueta="Año" obligatorio error={errores.anio}>
            <input id="anio" name="anio" type="number" className={claseControl(errores.anio)}
              value={valores.anio} onChange={cambiar} />
          </CampoForm>
        </div>
        <div className="col-md-4">
          <CampoForm id="kilometraje" etiqueta="Kilometraje" obligatorio error={errores.kilometraje}>
            <input id="kilometraje" name="kilometraje" type="number" min="0"
              className={claseControl(errores.kilometraje)} value={valores.kilometraje} onChange={cambiar} />
          </CampoForm>
        </div>
        <div className="col-md-4">
          <CampoForm id="estado" etiqueta="Estado" obligatorio error={errores.estado}>
            <select id="estado" name="estado" className={claseControl(errores.estado, "form-select")}
              value={valores.estado} onChange={cambiar}>
              {ESTADOS_VEHICULO.map((e) => (
                <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
              ))}
            </select>
          </CampoForm>
        </div>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear vehículo"}
        </button>
        <Link to="/vehiculos" className="btn btn-outline-secondary">Cancelar</Link>
      </div>
    </form>
  );
}
