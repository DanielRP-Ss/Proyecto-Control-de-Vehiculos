# Participantes:

Daniel Rojas C5J232
Malcolm Méndez C4H192
Yariel Jiménez C4G183

## Requisitos

- Python 3.12+
- MySQL 8.0+ para pruebas rápidas se puede usar
- Dependencias en `requirements.txt`

## Instalación

```bash
# 1. Clonar el repositorio y entrar a la carpeta.
https://github.com/DanielRP-Ss/Proyecto-Control-de-Vehiculos.git

# 2. Crear y activar el entorno virtual.
python -m venv .venv
.venv\Scripts\activate

# 3. Instalar dependencias.
pip install -r requirements.txt

# 4. Configurar variables de entorno.
cp .env.example .env 
```

## Base de datos (MySQL)

Crear la base de datos y el usuario:

```sql
CREATE DATABASE IF NOT EXISTS control_vehiculos_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'control_vehiculos_user'@'%' IDENTIFIED BY 'TuPassword123';

GRANT ALL PRIVILEGES ON control_vehiculos_db.* TO 'control_vehiculos_user'@'%';

FLUSH PRIVILEGES;
```

## Migraciones y usuarios de prueba

```bash
python manage.py migrate
python manage.py crear_usuarios_demo   
python manage.py createsuperuser      
python manage.py runserver
```

El comando `crear_usuarios_demo` crea los grupos de roles y estos usuarios:

| Usuario     | Contraseña      | Rol                  |
|-------------|-----------------|----------------------|
| `admin`     | `Admin123*`     | Administrador (staff)|
| `operador`  | `Operador123*`  | Operador             |
| `consulta`  | `Consulta123*`  | Consulta             |

## Ejecución de pruebas automatizadas

```bash
python manage.py test
```

Son 34 pruebas: 5 casos CRUD, reglas de negocio (respuestas 400),
3 permisos (401/403) y casos de paginación y filtros.

## Autenticación

Autenticación por token de DRF. Obtener el token:

```
POST /api/auth/login/
{ "username": "operador", "password": "Operador123*" }
```

Usar el token en cada solicitud:

```
Authorization: Token <token>
```

## Matriz de permisos

| Recurso / operación              | Administrador | Operador | Consulta |
|----------------------------------|:-------------:|:--------:|:--------:|
| Vehículos (CRUD)                 | CRUD          | Lectura  | Lectura  |
| Mantenimientos (CRUD)            | CRUD          | Lectura  | Lectura  |
| Proveedores (CRUD)               | CRUD          | Lectura  | Lectura  |
| Repuestos (CRUD)                 | CRUD          | Lectura  | Lectura  |
| Órdenes de trabajo (crear/editar)| Sí            | Sí       | No (403) |
| Órdenes de trabajo (eliminar)    | Sí            | No (403) | No (403) |
| Comentarios/consumos (crear)     | Sí            | Sí       | No (403) |
| Consumo de repuesto (`/consumos/`)| Sí           | Sí       | No (403) |
| Resumen de inventario (lectura)  | Sí            | Sí       | Sí       |

Convención HTTP: usuario anónimo → **401**; rol sin permiso → **403**.

## Reglas de negocio

| ID    | Regla | Respuesta |
|-------|-------|-----------|
| RN-01 | La placa es única y se normaliza a mayúsculas/sin espacios. | 400 |
| RN-02 | El kilometraje objetivo de un mantenimiento debe ser mayor al kilometraje actual del vehículo (también en PATCH). | 400 |
| RN-03 | Un vehículo solo puede tener una orden de trabajo activa (ABIERTA o EN_PROCESO). | 400 |
| RN-04 | Una orden COMPLETADA o CANCELADA es inmutable (también en PATCH). | 400 |
| RN-05 | Completar una orden exige registrar la fecha de salida. | 400 |
| RN-06 | La fecha de salida no puede ser anterior a la fecha de ingreso. | 400 |
| RN-07 | El costo total de una orden nunca puede ser negativo. | 400 |
| RN-08 | Solo se pueden agregar repuestos a órdenes activas (ABIERTA o EN_PROCESO). | 400 |
| RN-09 | No se puede consumir más cantidad de la disponible en inventario (stock). | 400 |

## Catálogo de endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Devuelve el token y los roles del usuario. |
| POST | `/api/auth/logout/` | Invalida el token del usuario autenticado. |
| GET  | `/api/auth/perfil/` | Datos del usuario autenticado y sus roles. |

### Vehículos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/vehiculos/` | Lista paginada. Filtros: `estado`, `kilometraje_min`, `kilometraje_max`, `page`. |
| POST | `/api/vehiculos/` | Crea un vehículo (admin). |
| GET | `/api/vehiculos/<id>/` | Consulta un vehículo. |
| PUT/PATCH | `/api/vehiculos/<id>/` | Actualiza un vehículo (admin). |
| DELETE | `/api/vehiculos/<id>/` | Elimina un vehículo (admin). |

### Mantenimientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/mantenimientos/` | Lista paginada. Filtros: `estado`, `vehiculo`, `page`. |
| POST | `/api/mantenimientos/` | Programa un mantenimiento (admin). |
| GET | `/api/mantenimientos/<id>/` | Consulta un mantenimiento. |
| PUT/PATCH | `/api/mantenimientos/<id>/` | Actualiza un mantenimiento (admin). |
| DELETE | `/api/mantenimientos/<id>/` | Elimina un mantenimiento (admin). |

### Órdenes de trabajo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ordenes/` | Lista paginada. Filtros: `estado`, `vehiculo`, `buscar` (código o falla), `page`. |
| POST | `/api/ordenes/` | Crea una orden (operador o admin). |
| GET | `/api/ordenes/<id>/` | Consulta una orden. |
| PUT/PATCH | `/api/ordenes/<id>/` | Actualiza una orden (operador o admin). |
| DELETE | `/api/ordenes/<id>/` | Elimina una orden (solo admin). |

### Comentarios / consumos de órdenes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/comentarios/` | Lista paginada. Filtro: `orden`, `page`. |
| POST | `/api/comentarios/` | Agrega un repuesto consumido a una orden (operador o admin). |
| GET | `/api/comentarios/<id>/` | Consulta un consumo. |
| DELETE | `/api/comentarios/<id>/` | Elimina un consumo (solo admin). |

### Inventario de repuestos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/inventario/` | Lista paginada. Filtros combinables: `buscar`, `proveedor`, `bajo_stock` (0/1); ordenamiento: `ordenar` (`id`, `nombre`, `precio_unitario`, `-precio_unitario`, `stock`, `-stock`); `page`. |
| POST | `/api/inventario/` | Crea un repuesto (admin). |
| GET | `/api/inventario/resumen/` | Agregación: total de tipos, unidades y valor del inventario. |
| POST | `/api/inventario/consumos/` | Registra el consumo de un repuesto en una orden: descuenta stock y suma al costo de la orden (operador o admin). Cuerpo: `{ "orden", "repuesto", "cantidad" }`. |
| GET | `/api/inventario/<id>/` | Consulta un repuesto. |
| PUT/PATCH | `/api/inventario/<id>/` | Actualiza un repuesto (admin). |
| DELETE | `/api/inventario/<id>/` | Elimina un repuesto (admin); 409 si tiene consumos asociados. |

### Proveedores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/proveedores/` | Lista paginada. Búsqueda: `buscar` (nombre o cédula), `page`. |
| POST | `/api/proveedores/` | Crea un proveedor (admin). |
| GET | `/api/proveedores/<id>/` | Consulta un proveedor. |
| PUT/PATCH | `/api/proveedores/<id>/` | Actualiza un proveedor (admin). |
| DELETE | `/api/proveedores/<id>/` | Elimina un proveedor (admin); 409 si tiene repuestos asociados. |

Las respuestas de listado incluyen `pagina_actual`, `total_paginas`,
`total_registros` y `resultados`.


En `postman/vehiculos-mantenimientos.postman_collection.json` hay 24 solicitudes
organizadas por modulo. Configurar la variable de colección `baseUrl` con
`http://127.0.0.1:8000/api` y `token` con el valor devuelto por `/api/auth/login/`.

## Flujo de negocio

1. El administrador carga los catálogos: proveedores, repuestos, vehículos
   y mantenimientos programados.
2. El operador registra la orden de trabajo de un vehículo que ingresa al
   taller (un vehículo solo puede tener una orden activa).
3. Durante el servicio, el operador consume repuestos: el sistema descuenta
   el inventario de forma atómica (`select_for_update` + `F()`) y acumula
   el costo en la orden.
4. Al completar la orden se exige la fecha de salida; la queda cerrada e
   inmutable y libera al vehículo para una nueva orden.

## Limitaciones conocidas

- Sin endpoints de carga masiva ni reportes exportables.
- La paginación es por número de página (tamaño fijo: 5 u 10 según el
  recurso), no configurable por el cliente.
- El inventario no registra movimientos de entrada (compras) ni ajustes;
  solo salidas por consumo.

---

# Frontend — SPA con React y Vite (Proyecto 2)

Interfaz web de tipo Single Page Application que consume la API REST
anterior mediante `fetch`. Incluye login con token, dashboard con
indicadores reales, cinco módulos de negocio con CRUD, filtros,
búsqueda, ordenamiento, paginación y manejo de errores 400/401/403/404/409.

## Requisitos

- Node.js 18+ y npm.
- El backend corriendo en `http://127.0.0.1:8000` (ver secciones anteriores).

## Instalación y ejecución

```bash
# 1. Entrar a la carpeta del frontend.
cd Frontend

# 2. Instalar dependencias.
npm install

# 3. Configurar la URL base de la API.
cp .env.example .env   # Windows: copy .env.example .env
# El valor por defecto es VITE_API_URL=http://127.0.0.1:8000/api

# 4. Iniciar el servidor de desarrollo (Vite, puerto 5173).
npm run dev
```

Abrir `http://localhost:5173` en el navegador.

## Configuración de CORS

El backend usa `django-cors-headers` y permite explícitamente los orígenes
del servidor de desarrollo de Vite en `Control_de_vehiculos/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
```

Si el frontend se sirve desde otro origen (otro puerto o dominio), hay que
agregarlo a esa lista y reiniciar el backend; de lo contrario el navegador
bloquea las solicitudes con un error de CORS. Las credenciales no se envían
por cookies: el token viaja en el encabezado `Authorization: Token <token>`,
por lo que no se requiere `CORS_ALLOW_CREDENTIALS`.

## Autenticación y cierre de sesión

- El login es `POST /api/auth/login/` y devuelve un token de DRF que el
  frontend guarda en `localStorage` y adjunta en cada solicitud
  (`Frontend/src/api/api.js`).
- **El token sí se revoca en el servidor**: `POST /api/auth/logout/`
  invalida el token del usuario autenticado. Además, el frontend limpia
  `localStorage` y redirige a `/login`.
- Si una solicitud recibe 401, el cliente limpia la sesión local y
  redirige al login (sesión expirada o token inválido).
- Las rutas privadas se protegen con `PrivateRoute`
  (`Frontend/src/routes/PrivateRoute.jsx`); el estado de autenticación se
  comparte con `AuthContext`.

## Usuarios de prueba

Los mismos creados por `python manage.py crear_usuarios_demo`
(ver tabla en la sección *Migraciones y usuarios de prueba*):
`admin / Admin123*`, `operador / Operador123*`, `consulta / Consulta123*`.
Son usuarios ficticios exclusivos para desarrollo y demostración.