import { Navigate, Route, Routes } from "react-router-dom";
import VehiculosLista from "./VehiculosLista";
import VehiculoFormPage from "./VehiculoFormPage";

// Se monta en App.jsx como <Route path="/vehiculos/*" element={<Vehiculos />} />
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
