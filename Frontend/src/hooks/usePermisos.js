import { useAuth } from "../context/AuthContext";
export function usePermisos() {
  const { user } = useAuth();
  const roles = user?.usuario?.roles ?? user?.roles ?? [];
  const esAdmin = roles.includes("Administrador");
  return { roles, esAdmin };
}
