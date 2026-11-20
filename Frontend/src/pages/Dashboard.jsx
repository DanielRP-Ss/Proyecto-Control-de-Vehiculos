import { useEffect, useState } from "react";
import { get } from "../api/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [inv, ord, veh] = await Promise.all([
          get("/inventario/resumen/"),
          get("/ordenes/?estado=ABIERTA"),
          get("/vehiculos/"),
        ]);
        if (!inv.ok || !ord.ok || !veh.ok) {
          throw new Error("Error al consultar la API.");
        }
        setData({
          valorInventario: inv.datos.valor_inventario,
          totalUnidades: inv.datos.total_unidades,
          ordenesActivas: ord.datos.total_registros,
          totalVehiculos: veh.datos.total_registros,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) return <p className="text-muted">Cargando indicadores...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const tarjetas = [
    { titulo: "Vehículos registrados", valor: data.totalVehiculos },
    { titulo: "Órdenes activas", valor: data.ordenesActivas },
    { titulo: "Unidades en inventario", valor: data.totalUnidades },
    { titulo: "Valor del inventario", valor: `₡${data.valorInventario}` },
  ];

  return (
    <>
      <h4 className="mb-4">Dashboard</h4>
      <div className="row g-3">
        {tarjetas.map((t) => (
          <div key={t.titulo} className="col-12 col-md-6 col-xl-3">
            <div className="card p-3 shadow-sm text-center">
              <small className="text-muted">{t.titulo}</small>
              <h3 className="mb-0">{t.valor}</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}