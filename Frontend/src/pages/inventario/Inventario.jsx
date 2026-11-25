import { Navigate, Route, Routes } from "react-router-dom";
import InventarioLista from "./InventarioLista";
import RepuestoFormPage from "./RepuestoFormPage";
import RepuestoDetalle from "./RepuestoDetalle";

export default function Inventario() {
  return (
    <Routes>
      <Route index element={<InventarioLista />} />

      <Route
        path="nuevo"
        element={<RepuestoFormPage />}
      />

      <Route
        path=":id/editar"
        element={<RepuestoFormPage />}
      />

      <Route
        path=":id"
        element={<RepuestoDetalle />}
      />

      <Route
        path="*"
        element={<Navigate to="/inventario" replace />}
      />
    </Routes>
  );
}