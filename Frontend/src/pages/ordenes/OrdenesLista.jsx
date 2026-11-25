import { useConsulta } from "../../hooks/useConsulta";
import { usePermisos } from "../../hooks/usePermisos";

import {
  listarOrdenes,
  eliminarOrden
} from "../../services/ordenesService";

import {
  listarTodosLosVehiculos
} from "../../services/vehiculosService";

import {
  activa,
  dinero,
  fecha,
  estados
} from "../bloqueC/compartido";

import ListaModulo from "../bloqueC/ListaModulo";
import AlertError from "../../components/AlertError";

const CLAVES = [
  "buscar",
  "estado",
  "vehiculo",
  "page"
];

export default function OrdenesLista() {
  const { esAdmin, roles } = usePermisos();

  const opera = esAdmin || roles.includes("Operador");

  const vehiculos = useConsulta(listarTodosLosVehiculos);

  const opciones = (vehiculos.datos || []).map(v => ({
    value: v.id,
    label: v.placa
  }));

  return (
    <>
      <AlertError error={vehiculos.error} />

      <ListaModulo
        titulo="Órdenes de trabajo"
        ruta="/ordenes"
        claves={CLAVES}
        listar={listarOrdenes}
        eliminar={eliminarOrden}
        puedeCrear={opera}
        puedeEditar={r => opera && activa(r)}
        puedeEliminar={() => esAdmin}
        filtros={[
          {
            nombre: "buscar",
            etiqueta: "Código o falla"
          },
          {
            nombre: "estado",
            etiqueta: "Estado",
            opciones: estados.map(s => ({
              value: s,
              label: s
            }))
          },
          {
            nombre: "vehiculo",
            etiqueta: "Vehículo",
            opciones
          }
        ]}
        columnas={[
          {
            titulo: "Código",
            ver: r => r.codigo
          },
          {
            titulo: "Vehículo",
            ver: r =>
              opciones.find(v => v.value === r.vehiculo)?.label ||
              r.vehiculo
          },
          {
            titulo: "Estado",
            ver: r => r.estado
          },
          {
            titulo: "Ingreso",
            ver: r => fecha(r.fecha_ingreso)
          },
          {
            titulo: "Costo",
            ver: r => dinero(r.costo_total)
          }
        ]}
      />
    </>
  );
}