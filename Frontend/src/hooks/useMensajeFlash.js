import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
