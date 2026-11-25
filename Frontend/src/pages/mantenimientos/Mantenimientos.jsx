import { Navigate, Route, Routes } from "react-router-dom";
import MantenimientosLista from "./MantenimientosLista";
import MantenimientoFormPage from "./MantenimientoFormPage";

// Se monta en App.jsx como <Route path="/mantenimientos/*" element={<Mantenimientos />} />
export default function Mantenimientos() {
  return (
    <Routes>
      <Route index element={<MantenimientosLista />} />
      <Route path="nuevo" element={<MantenimientoFormPage />} />
      <Route path=":id/editar" element={<MantenimientoFormPage />} />
      <Route path="*" element={<Navigate to="/mantenimientos" replace />} />
    </Routes>
  );
}
