import { useConsulta } from "../../hooks/useConsulta";
import { useFormulario } from "../../hooks/useFormulario";

import {
  listarTodosLosRepuestos,
  registrarConsumo
} from "../../services/inventarioService";

import Campo from "../bloqueC/Campo";
import AlertError from "../../components/AlertError";
import Loader from "../../components/Loader";
import { dinero } from "../bloqueC/compartido";

export default function ConsumoFormulario({
  orden,
  onExito
}) {
  const r = useConsulta(listarTodosLosRepuestos);

  const form = useFormulario({
    inicial: {
      repuesto: "",
      cantidad: "1"
    },
    campos: ["repuesto", "cantidad"]
  });

  const seleccionado = r.datos?.find(
    p => p.id === Number(form.valores.repuesto)
  );

  async function enviar(e) {
    e.preventDefault();

    if (form.guardando) return;

    const cantidad = Number(form.valores.cantidad);
    const errores = {};

    if (!seleccionado) {
      errores.repuesto = "Seleccione un repuesto";
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      errores.cantidad =
        "Cantidad debe ser un entero positivo";
    } else if (
      seleccionado &&
      cantidad > seleccionado.stock
    ) {
      errores.cantidad = "Stock insuficiente";
    }

    form.setErroresLocales(errores);
    form.setErrorServidor(null);

    if (Object.keys(errores).length) return;

    form.setGuardando(true);

    const res = await registrarConsumo({
      orden: orden.id,
      repuesto: seleccionado.id,
      cantidad
    });

    form.setGuardando(false);

    if (res.ok) {
      onExito(
        res.datos?.mensaje ||
        "Consumo registrado correctamente."
      );

      r.recargar();
    } else {
      form.setErrorServidor(res);
    }
  }

  if (r.cargando) return <Loader />;

  if (r.error) return <AlertError error={r.error} />;

  return (
    <form
      className="card card-body mb-3"
      onSubmit={enviar}
    >
      <h5>Registrar consumo</h5>

      <AlertError error={form.general} />

      <Campo
        form={form}
        nombre="repuesto"
        etiqueta="Repuesto"
        opciones={r.datos.map(p => ({
          value: p.id,
          label: `${p.nombre} — stock: ${p.stock}`
        }))}
      />

      <Campo
        form={form}
        nombre="cantidad"
        etiqueta="Cantidad"
        tipo="number"
        min="1"
        step="1"
      />

      {seleccionado && (
        <p>
          Subtotal estimado:{" "}
          {dinero(
            seleccionado.precio_unitario *
              Number(form.valores.cantidad)
          )}
        </p>
      )}

      <button
        className="btn btn-primary"
        disabled={form.guardando}
      >
        Registrar consumo
      </button>
    </form>
  );
}