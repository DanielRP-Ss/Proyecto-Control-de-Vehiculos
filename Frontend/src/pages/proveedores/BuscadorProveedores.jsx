import { useState } from "react";

// La búsqueda la resuelve el servidor (?buscar= por nombre o cédula jurídica).
export default function BuscadorProveedores({ inicial, onBuscar }) {
  const [texto, setTexto] = useState(inicial ?? "");

  const buscar = (e) => {
    e.preventDefault();
    onBuscar({ buscar: texto, page: "" });
  };

  const limpiar = () => {
    setTexto("");
    onBuscar({ buscar: "", page: "" });
  };

  return (
    <form onSubmit={buscar} className="card card-body mb-3" role="search">
      <div className="row g-2 align-items-end">
        <div className="col-12 col-md-9">
          <label htmlFor="buscar" className="form-label mb-1">Buscar por nombre o cédula jurídica</label>
          <input id="buscar" className="form-control" value={texto} onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej.: Repuestos del Pacífico o 3-101" />
        </div>
        <div className="col-12 col-md-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary flex-grow-1">Buscar</button>
          <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>Limpiar</button>
        </div>
      </div>
    </form>
  );
}
