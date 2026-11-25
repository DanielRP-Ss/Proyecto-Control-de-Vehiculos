import { useState } from "react";
import { ESTADOS_MANTENIMIENTO } from "../../utils/constantes";
const VACIO = { estado: "", vehiculo: "" };
export default function FiltrosMantenimientos({ inicial, vehiculos, onAplicar }) {
  const [valores, setValores] = useState({ ...VACIO, ...inicial });
  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });
  const aplicar = (e) => {
    e.preventDefault();
    onAplicar({ ...valores, page: "" });
  };
  const limpiar = () => {
    setValores(VACIO);
    onAplicar({ ...VACIO, page: "" });
  };
  return (
    <form onSubmit={aplicar} className="card card-body mb-3">
      <div className="row g-2 align-items-end">
        <div className="col-12 col-md-4">
          <label htmlFor="f-estado" className="form-label mb-1">Estado</label>
          <select id="f-estado" name="estado" className="form-select" value={valores.estado} onChange={cambiar}>
            <option value="">Todos</option>
            {ESTADOS_MANTENIMIENTO.map((e) => (
              <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-5">
          <label htmlFor="f-vehiculo" className="form-label mb-1">Vehículo</label>
          <select id="f-vehiculo" name="vehiculo" className="form-select" value={valores.vehiculo} onChange={cambiar}>
            <option value="">Todos</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">Filtrar</button>
          <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>Limpiar</button>
        </div>
      </div>
    </form>
  );
}
