# Matriz de pantallas y endpoints (Req. 16)

Cada acción de la interfaz (`Frontend/src`) vinculada con su método y ruta
REST. URL base configurable: `VITE_API_URL` (por defecto
`http://127.0.0.1:8000/api`). Todas las rutas excepto el login exigen el
encabezado `Authorization: Token <token>`.

## Autenticación y layout

| Pantalla / acción | Componente | Método | Endpoint | Parámetros / notas |
|---|---|---|---|---|
| Login (formulario usuario + contraseña) | `pages/Login.jsx`, `context/AuthContext.jsx` | POST | `/auth/login/` | `{ username, password }` → guarda `token` y `user` en `localStorage` |
| Logout (menú superior) | `context/AuthContext.jsx` | POST | `/auth/logout/` | Revoca el token en el servidor y limpia `localStorage` |
| Protección de rutas privadas | `routes/PrivateRoute.jsx` | — | — | Redirige a `/login` si no hay sesión |
| Redirección por 401 | `api/api.js` | — | — | Cualquier 401 limpia la sesión y envía a `/login` |
| Barra superior con usuario activo | `layout/AppLayout.jsx` | — | — | Lee el usuario de `AuthContext` |

## Dashboard

| Pantalla / acción | Componente | Método | Endpoint | Indicador mostrado |
|---|---|---|---|---|
| Dashboard (4 tarjetas) | `pages/Dashboard.jsx` | GET | `/inventario/resumen/` | Valor del inventario (₡) y unidades en inventario |
| | | GET | `/ordenes/?estado=ABIERTA` | Órdenes activas (`total_registros`) |
| | | GET | `/vehiculos/` | Vehículos registrados (`total_registros`) |

## Módulo Vehículos (`/vehiculos`)

| Pantalla / acción | Componente | Método | Endpoint | Parámetros / notas |
|---|---|---|---|---|
| Listado con filtros y paginación | `VehiculosLista.jsx`, `FiltrosVehiculos.jsx` | GET | `/vehiculos/` | `estado`, `kilometraje_min`, `kilometraje_max`, `page` |
| Crear vehículo | `VehiculoFormPage.jsx`, `VehiculoFormulario.jsx` | POST | `/vehiculos/` | Validación previa en `validarVehiculo.js`; el backend revalida RN-01 |
| Consultar vehículo (detalle vinculado) | `OrdenDetalle.jsx` / `MantenimientoFormulario.jsx` | GET | `/vehiculos/<id>/` | Selector de vehículo cargado desde la API |
| Editar vehículo (precargado) | `VehiculoFormPage.jsx` | GET + PUT | `/vehiculos/<id>/` | GET precarga el formulario; PUT guarda |
| Eliminar vehículo (con confirmación) | `VehiculosLista.jsx`, `ConfirmModal.jsx` | DELETE | `/vehiculos/<id>/` | Solo admin; error visible si aplica |

## Módulo Mantenimientos (`/mantenimientos`)

| Pantalla / acción | Componente | Método | Endpoint | Parámetros / notas |
|---|---|---|---|---|
| Listado con filtros y paginación | `MantenimientosLista.jsx`, `FiltrosMantenimientos.jsx` | GET | `/mantenimientos/` | `estado`, `vehiculo`, `page` |
| Crear mantenimiento | `MantenimientoFormPage.jsx`, `MantenimientoFormulario.jsx` | POST | `/mantenimientos/` | Selector de vehículo consultado a la API (todas las páginas) |
| Editar mantenimiento (precargado) | `MantenimientoFormPage.jsx` | GET + PATCH | `/mantenimientos/<id>/` | El backend revalida RN-02 también en PATCH |
| Eliminar mantenimiento | `MantenimientosLista.jsx` | DELETE | `/mantenimientos/<id>/` | Solo admin |

## Módulo Proveedores (`/proveedores`)

| Pantalla / acción | Componente | Método | Endpoint | Parámetros / notas |
|---|---|---|---|---|
| Listado con búsqueda y paginación | `ProveedoresLista.jsx`, `BuscadorProveedores.jsx` | GET | `/proveedores/` | `buscar` (nombre o cédula), `page` |
| Crear proveedor | `ProveedorFormPage.jsx`, `ProveedorFormulario.jsx` | POST | `/proveedores/` | Validación previa en `validarProveedor.js` |
| Editar proveedor (precargado) | `ProveedorFormPage.jsx` | GET + PUT | `/proveedores/<id>/` | PUT guarda los cambios |
| Eliminar proveedor | `ProveedoresLista.jsx` | DELETE | `/proveedores/<id>/` | 409 visible si tiene repuestos asociados (RN borrado protegido) |

## Módulo Inventario (`/inventario`)

| Pantalla / acción | Componente | Método | Endpoint | Parámetros / notas |
|---|---|---|---|---|
| Listado con filtros combinables, ordenamiento y paginación | `InventarioLista.jsx` | GET | `/inventario/` | `buscar`, `proveedor`, `bajo_stock` (0/1), `ordenar` (`id`, `nombre`, `precio_unitario`, `-precio_unitario`, `stock`, `-stock`), `page` |
| Detalle de repuesto | `RepuestoDetalle.jsx` | GET | `/inventario/<id>/` | Información vinculada (proveedor resuelto por nombre) |
| Crear repuesto | `RepuestoFormPage.jsx`, `RepuestoFormulario.jsx` | POST | `/inventario/` | Selector de proveedor consultado a la API |
| Editar repuesto (precargado) | `RepuestoFormPage.jsx` | GET + PATCH | `/inventario/<id>/` | PATCH guarda los cambios |
| Eliminar repuesto | `InventarioLista.jsx` | DELETE | `/inventario/<id>/` | 409 visible si tiene consumos asociados |

## Módulo Órdenes de trabajo (`/ordenes`)

| Pantalla / acción | Componente | Método | Endpoint | Parámetros / notas |
|---|---|---|---|---|
| Listado con búsqueda, filtros y paginación | `OrdenesLista.jsx` | GET | `/ordenes/` | `estado`, `vehiculo`, `buscar` (código o falla), `page` |
| Crear orden | `OrdenFormPage.jsx`, `OrdenFormulario.jsx` | POST | `/ordenes/` | Selector de vehículo consultado a la API |
| Detalle de orden (relaciones) | `OrdenDetalle.jsx` | GET | `/ordenes/<id>/` + `/vehiculos/<id>/` | Muestra placa del vehículo, costo total, estado |
| Editar orden (precargado) | `OrdenFormPage.jsx` | GET + PATCH | `/ordenes/<id>/` | RN-03/04/05/06 revalidadas por el backend |
| Eliminar orden | `OrdenesLista.jsx` | DELETE | `/ordenes/<id>/` | Solo admin, con confirmación |
| Historial de consumos de una orden | `OrdenDetalle.jsx` | GET | `/comentarios/` | `orden`, `page` (paginado) |
| Registrar consumo de repuesto | `ConsumoFormulario.jsx` | POST | `/comentarios/` | `{ orden, repuesto, cantidad }`; descuenta stock y suma costo (transacción atómica) |
| Eliminar consumo | `OrdenDetalle.jsx` | DELETE | `/comentarios/<id>/` | Solo admin |
| Selector de repuestos en consumo | `OrdenDetalle.jsx` | GET | `/inventario/` | Recorre todas las páginas (`cargarTodasLasPaginas`) |

## Convenciones transversales

| Aspecto | Implementación |
|---|---|
| Cliente HTTP centralizado | `api/api.js` (URL base, token, manejo de 401) |
| Servicios por módulo | `services/*Service.js` (sin URLs absolutas en componentes) |
| Parámetros de query | `utils/http.js` → `construirQuery` |
| Fallo de red | `utils/http.js` → `llamar` devuelve `{ ok: false, status: 0 }`; la UI muestra mensaje comprensible |
| Paginación | `components/Pagination.jsx` consume `pagina_actual`, `total_paginas`, `total_registros` |
| Estados | `Loader`, `EmptyState`, `AlertError`, `AlertSuccess` en `components/` |
