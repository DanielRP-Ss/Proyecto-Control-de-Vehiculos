import { Navigate, Route, Routes } from "react-router-dom";
import VehiculosLista from "./VehiculosLista";
import VehiculoFormPage from "./VehiculoFormPage";
export default function Vehiculos() {
  return (
    <Routes>
      <Route index element={<VehiculosLista />} />
      <Route path="nuevo" element={<VehiculoFormPage />} />
      <Route path=":id/editar" element={<VehiculoFormPage />} />
      <Route path="*" element={<Navigate to="/vehiculos" replace />} />
    </Routes>
  );
}
