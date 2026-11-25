import { useAuth } from "../context/AuthContext";

// El login del backend devuelve { token, usuario: { id, username, email, roles } }
// y AuthContext guarda esa respuesta completa en `user`.
// Roles posibles: "Administrador" (is_staff), "Operador", "Consulta".
// Esto SOLO adapta la interfaz: la autorización real la aplica Django (401/403).
export function usePermisos() {
  const { user } = useAuth();
  const roles = user?.usuario?.roles ?? user?.roles ?? [];
  const esAdmin = roles.includes("Administrador");
  return { roles, esAdmin };
}
