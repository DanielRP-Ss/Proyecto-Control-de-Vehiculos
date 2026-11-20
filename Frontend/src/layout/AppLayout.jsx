import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menu = [
  { to: "/", label: "Dashboard" },
  { to: "/vehiculos", label: "Vehículos" },
  { to: "/mantenimientos", label: "Mantenimientos" },
  { to: "/proveedores", label: "Proveedores" },
  { to: "/inventario", label: "Inventario" },
  { to: "/ordenes", label: "Órdenes" },
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex min-vh-100">
      <aside className="bg-dark text-white p-3" style={{ width: 220 }}>
        <h5 className="mb-4">Control de Taller</h5>
        <nav className="nav flex-column">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-link rounded ${isActive ? "bg-primary text-white" : "text-white-50"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-grow-1">
        <header className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white">
          <span className="text-muted">
            {user?.username}
            {user?.groups?.length > 0 && (
              <span className="badge bg-secondary ms-2">
                {user.groups.join(", ")}
              </span>
            )}
          </span>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}