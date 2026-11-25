import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import AppLayout from "./layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehiculos from "./pages/vehiculos/Vehiculos";
import Mantenimientos from "./pages/mantenimientos/Mantenimientos";
import Proveedores from "./pages/proveedores/Proveedores";
import Inventario from "./pages/inventario/Inventario";
import Ordenes from "./pages/ordenes/Ordenes";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/vehiculos/*"
              element={<Vehiculos />}
            />
            <Route
              path="/mantenimientos/*"
              element={<Mantenimientos />}
            />
            <Route
              path="/proveedores/*"
              element={<Proveedores />}
            />
            <Route
              path="/inventario/*"
              element={<Inventario />}
            />
            <Route
              path="/ordenes/*"
              element={<Ordenes />}
            />
          </Route>
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
