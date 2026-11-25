export default function Pagination({ pagina, totalPaginas, onCambiarPagina }) {
  if (totalPaginas <= 1) return null;
  return (
    <nav className="d-flex justify-content-between align-items-center mt-3">
      <small className="text-muted">Página {pagina} de {totalPaginas}</small>
      <div className="btn-group">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={pagina <= 1}
          onClick={() => onCambiarPagina(pagina - 1)}
        >
          ← Anterior
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={pagina >= totalPaginas}
          onClick={() => onCambiarPagina(pagina + 1)}
        >
          Siguiente →
        </button>
      </div>
    </nav>
  );
}
