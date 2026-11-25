import { Navigate, Route, Routes } from "react-router-dom";
import OrdenesLista from "./OrdenesLista";
import OrdenFormPage from "./OrdenFormPage";
import OrdenDetalle from "./OrdenDetalle";

export default function Ordenes() {
  return (
    <Routes>
      <Route index element={<OrdenesLista />} />

      <Route
        path="nuevo"
        element={<OrdenFormPage />}
      />

      <Route
        path=":id/editar"
        element={<OrdenFormPage />}
      />

      <Route
        path=":id"
        element={<OrdenDetalle />}
      />

      <Route
        path="*"
        element={<Navigate to="/ordenes" replace />}
      />
    </Routes>
  );
}