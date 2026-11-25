import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err.message === "Credenciales no validas"
          ? "Usuario o contraseña incorrectos"
          : "No se pudo conectar con el servidor"
      );
    } finally {
      setCargando(false);
    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form onSubmit={submit} className="card p-4 shadow" style={{ width: 360 }}>
        <h4 className="mb-3 text-center">Iniciar sesión</h4>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <label className="form-label mb-1">Usuario</label>
        <input
          className="form-control mb-3"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          autoFocus
        />
        <label className="form-label mb-1">Contraseña</label>
        <input
          className="form-control mb-3"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn btn-primary w-100" disabled={cargando}>
          {cargando ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
