import { Navigate, Route, Routes } from "react-router-dom";
import ProveedoresLista from "./ProveedoresLista";
import ProveedorFormPage from "./ProveedorFormPage";
export default function Proveedores() {
  return (
    <Routes>
      <Route index element={<ProveedoresLista />} />
      <Route path="nuevo" element={<ProveedorFormPage />} />
      <Route path=":id/editar" element={<ProveedorFormPage />} />
      <Route path="*" element={<Navigate to="/proveedores" replace />} />
    </Routes>
  );
}
