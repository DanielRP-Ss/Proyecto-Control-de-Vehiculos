import { Link, useNavigate } from "react-router-dom";
import AlertError from "../../components/AlertError";
import AvisoSoloLectura from "../../components/AvisoSoloLectura";
import CampoForm from "../../components/CampoForm";
import { claseControl } from "../../utils/formularios";
import { useFormulario } from "../../hooks/useFormulario";
import { usePermisos } from "../../hooks/usePermisos";
import { actualizarProveedor, crearProveedor } from "../../services/proveedoresService";
import { CAMPOS_PROVEEDOR, validarProveedor } from "./validarProveedor";

const VACIO = { cedula_juridica: "", nombre: "", contacto: "" };

export default function ProveedorFormulario({ proveedor }) {
  const navigate = useNavigate();
  const { esAdmin } = usePermisos();
  const editando = Boolean(proveedor);

  const {
    valores, cambiar, errores, general, guardando,
    setGuardando, setErroresLocales, setErrorServidor,
  } = useFormulario({
    inicial: proveedor
      ? { cedula_juridica: proveedor.cedula_juridica, nombre: proveedor.nombre, contacto: proveedor.contacto }
      : VACIO,
    campos: CAMPOS_PROVEEDOR,
  });

  const enviar = async (e) => {
    e.preventDefault();
    setErrorServidor(null);
    const encontrados = validarProveedor(valores);
    setErroresLocales(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    const payload = {
      cedula_juridica: valores.cedula_juridica.trim(),
      nombre: valores.nombre.trim(),
      contacto: valores.contacto.trim(),
    };

    setGuardando(true);
    const res = editando ? await actualizarProveedor(proveedor.id, payload) : await crearProveedor(payload);
    setGuardando(false);

    if (res.ok) {
      navigate("/proveedores", {
        state: { exito: `Proveedor ${res.datos.nombre} ${editando ? "actualizado" : "creado"} correctamente.` },
      });
    } else {
      setErrorServidor(res);
    }
  };

  return (
    <form onSubmit={enviar} noValidate className="card card-body" style={{ maxWidth: 640 }}>
      {!esAdmin && <AvisoSoloLectura recurso="proveedores" />}
      <AlertError error={general} />

      <CampoForm id="cedula_juridica" etiqueta="Cédula jurídica" obligatorio error={errores.cedula_juridica}
        ayuda="Debe ser única. Ej.: 3-101-123456">
        <input id="cedula_juridica" name="cedula_juridica" className={claseControl(errores.cedula_juridica)}
          value={valores.cedula_juridica} onChange={cambiar} maxLength={25} autoComplete="off" />
      </CampoForm>

      <CampoForm id="nombre" etiqueta="Nombre" obligatorio error={errores.nombre}>
        <input id="nombre" name="nombre" className={claseControl(errores.nombre)} value={valores.nombre}
          onChange={cambiar} maxLength={120} />
      </CampoForm>

      <CampoForm id="contacto" etiqueta="Contacto" obligatorio error={errores.contacto}
        ayuda="Persona, teléfono o correo de contacto.">
        <input id="contacto" name="contacto" className={claseControl(errores.contacto)} value={valores.contacto}
          onChange={cambiar} maxLength={120} />
      </CampoForm>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear proveedor"}
        </button>
        <Link to="/proveedores" className="btn btn-outline-secondary">Cancelar</Link>
      </div>
    </form>
  );
}
