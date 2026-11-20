import { createContext, useContext, useState } from "react";
import { post } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    const res = await post("/auth/login/", { username, password });
    if (!res.ok) throw new Error("Credenciales inválidas");
    localStorage.setItem("token", res.datos.token);
    localStorage.setItem("user", JSON.stringify(res.datos));
    setUser(res.datos);
  };

  const logout = async () => {
    try {
      await post("/auth/logout/");
    } catch {
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);