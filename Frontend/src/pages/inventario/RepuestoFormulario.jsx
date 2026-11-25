import { Link, useNavigate } from "react-router-dom";
import { useFormulario } from "../../hooks/useFormulario";
import { usePermisos } from "../../hooks/usePermisos";

import {
  crearRepuesto,
  actualizarRepuesto
} from "../../services/inventarioService";

import Campo from "../bloqueC/Campo";
import AlertError from "../../components/AlertError";

const VACIO = {
  nombre: "",
  codigo: "",
  stock: "0",
  stock_minimo: "0",
  precio_unitario: "",
  proveedor: ""
};

export default function RepuestoFormulario({
  repuesto,
  proveedores
}) {
  const navigate = useNavigate();
  const { esAdmin } = usePermisos();

  const form = useFormulario({
    inicial: repuesto || VACIO,
    campos: Object.keys(VACIO)
  });

  async function enviar(e) {
    e.preventDefault();

    if (!esAdmin || form.guardando) return;

    const v = form.valores;
    const errores = {};

    for (const k of ["nombre", "codigo"]) {
      if (!v[k].trim()) {
        errores[k] = "Campo obligatorio";
      }
    }

    for (const k of ["stock", "stock_minimo"]) {
      if (!/^\d+$/.test(String(v[k]))) {
        errores[k] = "Ingrese un entero no negativo";
      }
    }

    if (
      !String(v.precio_unitario).trim() ||
      !Number.isFinite(Number(v.precio_unitario)) ||
      Number(v.precio_unitario) < 0
    ) {
      errores.precio_unitario = "Precio inválido";
    }

    if (!v.proveedor) {
      errores.proveedor = "Seleccione un proveedor";
    }

    form.setErroresLocales(errores);
    form.setErrorServidor(null);

    if (Object.keys(errores).length) return;

    const payload = {
      nombre: v.nombre.trim(),
      codigo: v.codigo.trim(),
      stock: Number(v.stock),
      stock_minimo: Number(v.stock_minimo),
      precio_unitario: Number(v.precio_unitario).toFixed(2),
      proveedor: Number(v.proveedor)
    };

    form.setGuardando(true);

    const res = await (
      repuesto
        ? actualizarRepuesto(repuesto.id, payload)
        : crearRepuesto(payload)
    );

    form.setGuardando(false);

    if (res.ok) {
      navigate("/inventario", {
        state: {
          exito: "Repuesto guardado correctamente."
        }
      });
    } else {
      form.setErrorServidor(res);
    }
  }

  return (
    <form
      className="card card-body"
      style={{ maxWidth: 640 }}
      onSubmit={enviar}
    >
      <AlertError error={form.general} />

      {!esAdmin && (
        <p className="alert alert-warning">
          Solo administradores pueden guardar.
        </p>
      )}

      <Campo
        form={form}
        nombre="nombre"
        etiqueta="Nombre"
        maxLength={120}
      />

      <Campo
        form={form}
        nombre="codigo"
        etiqueta="Código"
        maxLength={30}
      />

      <Campo
        form={form}
        nombre="stock"
        etiqueta="Stock"
        tipo="number"
        min="0"
        step="1"
      />

      <Campo
        form={form}
        nombre="stock_minimo"
        etiqueta="Stock mínimo"
        tipo="number"
        min="0"
        step="1"
      />

      <Campo
        form={form}
        nombre="precio_unitario"
        etiqueta="Precio unitario"
        tipo="number"
        min="0"
        step="0.01"
      />

      <Campo
        form={form}
        nombre="proveedor"
        etiqueta="Proveedor"
        opciones={proveedores.map(p => ({
          value: p.id,
          label: p.nombre
        }))}
      />

      <div className="d-flex gap-2">
        <button
          className="btn btn-primary"
          disabled={!esAdmin || form.guardando}
        >
          Guardar
        </button>

        <Link
          className="btn btn-outline-secondary"
          to="/inventario"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}