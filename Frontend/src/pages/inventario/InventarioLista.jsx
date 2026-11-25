import { useConsulta } from "../../hooks/useConsulta";
import { usePermisos } from "../../hooks/usePermisos";

import {
  listarRepuestos,
  eliminarRepuesto,
  resumenInventario
} from "../../services/inventarioService";

import {
  dinero,
  listarTodosLosProveedores
} from "../bloqueC/compartido";

import ListaModulo from "../bloqueC/ListaModulo";
import AlertError from "../../components/AlertError";

const CLAVES = [
  "buscar",
  "proveedor",
  "bajo_stock",
  "ordenar",
  "page"
];

export default function InventarioLista() {
  const { esAdmin } = usePermisos();

  const proveedores = useConsulta(listarTodosLosProveedores);
  const resumen = useConsulta(resumenInventario);

  const opciones = (proveedores.datos || []).map(p => ({
    value: p.id,
    label: p.nombre
  }));

  const columnas = [
    {
      titulo: "Código",
      ver: r => r.codigo
    },
    {
      titulo: "Nombre",
      ver: r => r.nombre
    },
    {
      titulo: "Stock",
      ver: r => (
        <span
          className={
            r.stock <= r.stock_minimo
              ? "text-danger fw-bold"
              : ""
          }
        >
          {r.stock}
        </span>
      )
    },
    {
      titulo: "Mínimo",
      ver: r => r.stock_minimo
    },
    {
      titulo: "Precio",
      ver: r => dinero(r.precio_unitario)
    },
    {
      titulo: "Proveedor",
      ver: r =>
        opciones.find(p => p.value === r.proveedor)?.label ||
        r.proveedor
    }
  ];

  const filtros = [
    {
      nombre: "buscar",
      etiqueta: "Nombre o código"
    },
    {
      nombre: "proveedor",
      etiqueta: "Proveedor",
      opciones
    },
    {
      nombre: "bajo_stock",
      etiqueta: "Existencias",
      opciones: [
        { value: "1", label: "Bajo stock" }
      ]
    },
    {
      nombre: "ordenar",
      etiqueta: "Ordenar",
      opciones: [
        { value: "nombre", label: "Nombre" },
        { value: "precio_unitario", label: "Precio ascendente" },
        { value: "-precio_unitario", label: "Precio descendente" },
        { value: "stock", label: "Stock ascendente" },
        { value: "-stock", label: "Stock descendente" }
      ]
    }
  ];

  return (
    <>
      <AlertError error={proveedores.error} />

      <ListaModulo
        titulo="Inventario"
        ruta="/inventario"
        claves={CLAVES}
        listar={listarRepuestos}
        eliminar={eliminarRepuesto}
        columnas={columnas}
        filtros={filtros}
        puedeCrear={esAdmin}
        puedeEditar={() => esAdmin}
        puedeEliminar={() => esAdmin}
        alCambiar={resumen.recargar}
        resumen={
          <>
            <AlertError error={resumen.error} />

            {resumen.datos && (
              <div className="row g-2 mb-3">
                {[
                  ["Tipos", resumen.datos.total_tipos],
                  ["Unidades", resumen.datos.total_unidades],
                  ["Valor", dinero(resumen.datos.valor_inventario)]
                ].map(([k, v]) => (
                  <div className="col-12 col-md" key={k}>
                    <div className="card card-body">
                      <small>{k}</small>
                      <strong>{v}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        }
      />
    </>
  );
}