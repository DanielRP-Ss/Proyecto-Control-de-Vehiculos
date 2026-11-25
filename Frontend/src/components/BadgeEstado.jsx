export default function BadgeEstado({ estado, opciones }) {
  const opcion = opciones.find((o) => o.valor === estado);
  return <span className={`badge ${opcion?.clase ?? "text-bg-light"}`}>{opcion?.etiqueta ?? estado}</span>;
}
