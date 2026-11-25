import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Mensaje de éxito que llega desde otra pantalla:
//   navigate("/vehiculos", { state: { exito: "Vehículo creado." } })
// Se muestra una vez y se borra del historial para que no reaparezca al recargar.
export function useMensajeFlash() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState(() => location.state?.exito ?? "");

  useEffect(() => {
    if (location.state?.exito) {
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
    }
  }, [location, navigate]);

  return [mensaje, setMensaje];
}
