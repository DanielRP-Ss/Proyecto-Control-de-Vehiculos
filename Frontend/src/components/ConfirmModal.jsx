export default function ConfirmModal({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar</h5>
            <button className="btn-close" onClick={onCancelar} />
          </div>
          <div className="modal-body">
            <p>{mensaje}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={onConfirmar}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}