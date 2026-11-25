import { useState } from "react";
import { ESTADOS_VEHICULO } from "../../utils/constantes";

const VACIO = { estado: "", kilometraje_min: "", kilometraje_max: "" };

// Los filtros se aplican en el servidor (query params de GET /vehiculos/).
export default function FiltrosVehiculos({ inicial, onAplicar }) {
  const [valores, setValores] = useState({ ...VACIO, ...inicial });
  const [errorLocal, setErrorLocal] = useState("");

  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  const aplicar = (e) => {
    e.preventDefault();
    const { kilometraje_min: min, kilometraje_max: max } = valores;
    if (min !== "" && max !== "" && Number(min) > Number(max)) {
      setErrorLocal("El kilometraje mínimo no puede ser mayor que el máximo.");
      return;
    }
    setErrorLocal("");
    onAplicar({ ...valores, page: "" });
  };

  const limpiar = () => {
    setValores(VACIO);
    setErrorLocal("");
    onAplicar({ ...VACIO, page: "" });
  };

  return (
    <form onSubmit={aplicar} className="card card-body mb-3" noValidate>
      <div className="row g-2 align-items-end">
        <div className="col-12 col-md-3">
          <label htmlFor="f-estado" className="form-label mb-1">Estado</label>
          <select id="f-estado" name="estado" className="form-select" value={valores.estado} onChange={cambiar}>
            <option value="">Todos</option>
            {ESTADOS_VEHICULO.map((e) => (
              <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="f-km-min" className="form-label mb-1">Km mínimo</label>
          <input id="f-km-min" name="kilometraje_min" type="number" min="0" className="form-control"
            value={valores.kilometraje_min} onChange={cambiar} />
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="f-km-max" className="form-label mb-1">Km máximo</label>
          <input id="f-km-max" name="kilometraje_max" type="number" min="0" className="form-control"
            value={valores.kilometraje_max} onChange={cambiar} />
        </div>
        <div className="col-12 col-md-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">Filtrar</button>
          <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>Limpiar</button>
        </div>
      </div>
      {errorLocal && <div className="text-danger small mt-2">{errorLocal}</div>}
    </form>
  );
}
