# Matriz de perfiles/permisos y escenarios de prueba manual 

## Matriz de perfiles en la interfaz

| Acción en la UI | Administrador | Operador | Consulta |
|---|:---:|:---:|:---:|
| Ver dashboard y navegar los 5 módulos | ✔ | ✔ | ✔ |
| Crear/editar/eliminar vehículos, mantenimientos, proveedores, repuestos | ✔ (botones visibles) | ✘ botones ocultos + aviso solo lectura | ✘ botones ocultos + aviso solo lectura |
| Crear/editar órdenes de trabajo | ✔ | ✔ | ✘ (403 del backend) |
| Eliminar órdenes | ✔ | ✘ | ✘ |
| Registrar consumos de repuestos en orden activa | ✔ | ✔ | ✘ |
| Eliminar consumos | ✔ | ✘ | ✘ |
| Usar filtros, búsqueda, ordenamiento y paginación | ✔ | ✔ | ✔ |
| Cerrar sesión (logout con revocación de token) | ✔ | ✔ | ✔ |
| Respuesta del backend si se fuerza una acción no permitida | — | 403 | 403 (y 401 si no hay token) |

Usuarios de prueba (ficticios, creados por `python manage.py crear_usuarios_demo`):

| Perfil | Usuario | Contraseña |
|---|---|---|
| Administrador | `admin` | `Admin123*` |
| Operador | `operador` | `Operador123*` |
| Consulta | `consulta` | `Consulta123*` |

## Escenarios de prueba manual (12)

Precondición común: backend en `http://127.0.0.1:8000` (`python manage.py runserver`)
y frontend en `http://localhost:5173` (`npm run dev`). Evidencias en `capturas/`.

### E1 — Login exitoso
1. Abrir `http://localhost:5173` sin sesión → redirige a `/login`.
2. Ingresar `admin / Admin123*` y pulsar **Entrar**.
3. **Esperado:** redirección al dashboard; la barra superior muestra el usuario.
**Evidencia:** `capturas/01_login.png` (formulario) y `capturas/03_dashboard.png`.

### E2 — Login con credenciales inválidas
1. En `/login` ingresar `admin / claveIncorrecta`.
2. **Esperado:** mensaje "Usuario o contraseña incorrectos"; no se navega.
**Evidencia:** `capturas/02_error_validacion.png` (mensaje visible).

### E3 — Navegación protegida sin autenticación
1. Cerrar sesión y escribir directamente `http://localhost:5173/ordenes`.
2. **Esperado:** redirección inmediata a `/login` (`PrivateRoute`).
**Evidencia:** capturar la URL de login tras el intento.

### E4 — Logout con revocación de token
1. Con sesión activa, pulsar **Cerrar sesión** en la barra superior.
2. **Esperado:** `POST /api/auth/logout/` revoca el token (204); el frontend limpia
   `localStorage` y vuelve a `/login`. Reutilizar el token antiguo en Postman
   devuelve 401 → confirma la revocación en el servidor.
**Evidencia:** `capturas/13_logout.png` + registro de la respuesta 204.

### E5 — Crear registro (CRUD: alta)
1. Como `admin`, entrar a **Vehículos → Nuevo**.
2. Completar placa `SAN-123`, marca/modelo/año/kilometraje válidos; guardar.
3. **Esperado:** aviso de éxito y el registro aparece al listar (vista actualizada).
**Evidencia:** `capturas/09_formulario_vehiculo.png`.

### E6 — Consultar y editar con precarga (CRUD: modificación)
1. En **Vehículos**, pulsar **Editar** en un registro existente.
2. **Esperado:** el formulario llega precargado con los valores actuales (GET previo).
3. Cambiar el kilometraje y guardar → aviso de éxito y tabla actualizada.
**Evidencia:** misma captura del formulario con valores cargados.

### E7 — Eliminar con confirmación (CRUD: baja)
1. Como `admin`, en **Mantenimientos** pulsar **Eliminar** en un registro sin dependencias.
2. **Esperado:** modal de confirmación (`ConfirmModal`); al confirmar, desaparece del listado.
**Evidencia:** captura del modal + listado actualizado.

### E8 — Filtros combinables (inventario)
1. Como `operador`, entrar a **Inventario**.
2. Escribir texto en **buscar**, seleccionar un **proveedor** y marcar **bajo stock**.
3. **Esperado:** la tabla solo muestra registros que cumplen los tres criterios
   (parámetros `buscar`, `proveedor`, `bajo_stock` visibles en la URL/petición).
**Evidencia:** `capturas/07_inventario.png`.

### E9 — Búsqueda (proveedores)
1. En **Proveedores**, escribir una cédula o nombre parcial en el buscador.
2. **Esperado:** resultados filtrados por el backend (parámetro `buscar`); estado
   vacío comprensible si no hay coincidencias (`EmptyState`).
**Evidencia:** `capturas/06_proveedores.png`.

### E10 — Ordenamiento (inventario)
1. En **Inventario**, ordenar por **precio** descendente y luego por **stock**.
2. **Esperado:** el orden de las filas corresponde al criterio
   (`ordenar=-precio_unitario` / `ordenar=stock` en la petición).
**Evidencia:** `capturas/05_inventario.png`.

### E11 — Paginación (órdenes e inventario)
1. En **Órdenes de trabajo**, navegar a la página 2 con el paginador inferior.
2. Repetir en **Inventario** si hay más de una página.
3. **Esperado:** cambian los registros mostrados y el indicador de página
   (`pagina_actual` / `total_paginas`); al volver a la página 1 se restaura.
**Evidencia:** `capturas/08_ordenes.png`.

### E12 — Validación y accesos denegados (400 / 403 / 401)
1. Como `admin`, en **Mantenimientos → Nuevo** fijar un kilometraje objetivo
   **menor** al actual del vehículo y guardar.
   **Esperado:** el backend responde 400 y la UI muestra el mensaje de la regla RN-02.
2. Como `consulta`, forzar la navegación al formulario de creación (o intentar
   guardar): el backend responde **403** y la UI lo muestra.
3. Reutilizar un token revocado (ver E4) en cualquier endpoint: **401** y
   redirección al login.
**Evidencia:** `capturas/02_error_validacion.png` (error de login), `capturas/12_error_400_mantenimiento.png` (RN-02: el formulario valida antes de enviar y muestra "Debe ser mayor al kilometraje actual del vehículo") y `capturas/13_logout.png`.
