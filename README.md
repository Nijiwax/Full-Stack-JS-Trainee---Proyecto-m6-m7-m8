# ABP CRUD - Módulos 6 y 7 (Node.js + Express + PostgreSQL)

Aplicación web backend desarrollada con **Node.js**, **Express** y **PostgreSQL** (vía **Sequelize**), correspondiente a las Partes 1 y 2 del proyecto integrador ABP. Implementa un servidor con vistas dinámicas (Handlebars), una API RESTful para la gestión de usuarios y pedidos, persistencia real en base de datos relacional, relaciones entre entidades y transacciones.

🔗 **Repositorio:** https://github.com/Nijiwax/Full-Stack-JS-Trainee---Proyecto-m6-m7-m8
🔗 **Google Drive:** https://drive.google.com/drive/folders/1CRdNJZRxabL6oAYPrpsqsRPP-AK9JVKo?usp=drive_link
---

## 📋 Requisitos del sistema

- **Node.js** v18 o superior (desarrollado y probado en v22).
- **npm** (incluido con Node.js).
- **PostgreSQL** (local o en la nube) — a partir del Módulo 7, la aplicación requiere una base de datos real corriendo.

---

## ⚙️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Nijiwax/Full-Stack-JS-Trainee---Proyecto-m6-m7-m8.git
   cd preparacion-abp-m6
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Crear la base de datos en PostgreSQL (una sola vez):
   ```sql
   CREATE DATABASE abp_m7;
   ```

4. Copiar el archivo de variables de entorno de ejemplo y completar los valores reales:
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con tus credenciales de PostgreSQL:
   ```
   PORT=3000
   DB_NAME=abp_m7
   DB_USER=postgres
   DB_PASSWORD=tu_password_real
   DB_HOST=localhost
   DB_PORT=5432
   ```
   > ⚠️ El archivo `.env` **nunca** se sube al repositorio (está excluido en `.gitignore`). Solo `.env.example` (sin datos reales) queda versionado como plantilla.

5. Ejecutar el servidor (ver sección **Ejecución**).

---

## ▶️ Ejecución

| Script | Comando | Descripción |
|---|---|---|
| `npm run dev` | `node --watch server.js --port 3001` | Modo desarrollo: reinicia el servidor automáticamente ante cambios en el código. |
| `npm start` | `node server.js` | Modo producción/estándar, sin reinicio automático. |

Al iniciar, el servidor primero valida la conexión a la base de datos y sincroniza los modelos (crea las tablas si no existen), y recién después queda escuchando:

```
✅ Conexión a la base de datos establecida correctamente.
Servidor escuchando en http://localhost:3000
```

> El puerto se resuelve así: si existe la variable de entorno `PORT` (en `.env` o asignada por un hosting), se usa esa; si no, se usa el argumento `--port` de la línea de comandos (validado en el rango 3000-3010).

---

## 📂 Estructura del proyecto

```
preparacion-abp-m6/
├── server.js                        # Punto de entrada: conecta DB, sincroniza modelos y levanta el servidor
├── package.json
├── .env.example                     # Plantilla de variables de entorno (sin datos reales)
├── .env                             # Variables de entorno reales (NO se sube al repo)
├── logs/
│   ├── log.txt                      # Registro de accesos (Módulo 6)
│   └── transactions.log             # Registro de transacciones éxito/rollback (Módulo 7)
├── public/
│   └── assets/js/addUser.js
└── src/
    ├── app.js                       # Configuración de Express, Handlebars y montaje de rutas
    ├── config/
    │   └── database.js              # Configuración e instancia de Sequelize (conexión a PostgreSQL)
    ├── controllers/
    │   ├── users.controllers.js
    │   ├── pedidos.controllers.js   # Nuevo (Módulo 7)
    │   ├── status.controller.js
    │   └── views.controllers.js
    ├── middlewares/
    │   ├── validate_body.js
    │   └── logger.js
    ├── models/
    │   ├── index.js                 # Asociaciones entre modelos + sync (Módulo 7)
    │   ├── User.model.js            # Ahora es un modelo Sequelize (antes era JSON)
    │   └── Pedido.model.js          # Nuevo (Módulo 7)
    ├── services/                    # Nuevo (Módulo 7): lógica de negocio y acceso a datos
    │   ├── user.service.js
    │   └── pedido.service.js
    ├── routes/
    │   ├── users.routes.js
    │   ├── pedidos.routes.js        # Nuevo (Módulo 7)
    │   └── views.routes.js
    ├── utils/
    │   ├── utils.js
    │   └── transactionLogger.js     # Nuevo (Módulo 7)
    └── views/                        # Plantillas Handlebars
```

---

## 🧠 Justificación de decisiones técnicas

### Módulo 6

- **`server.js` + `src/app.js`**: se separó la configuración de Express (`app.js`) del arranque del servidor (`server.js`), facilitando testear `app` de forma aislada.
- **`node --watch` en vez de `nodemon`**: se usó la bandera nativa de Node 18+ para evitar sumar una dependencia externa.
- **Motor de plantillas Handlebars**: se usó en vez de servir solo contenido estático, para poder renderizar vistas dinámicas con datos reales del backend.

### Módulo 7

- **¿Por qué Sequelize + `pg` como cliente de conexión?** Se eligió `pg` (a través de Sequelize) por ser el driver oficial y más utilizado para PostgreSQL en Node.js. Sequelize se sumó sobre él como ORM porque permite trabajar con modelos, asociaciones (relaciones 1:N) y transacciones de forma declarativa, evitando escribir SQL manual repetitivo y reduciendo errores de sintaxis en consultas complejas.

- **¿Cómo se protegen los datos sensibles?** Las credenciales de la base de datos (usuario, contraseña, host, puerto) se leen exclusivamente desde variables de entorno (`.env`), que está excluido del repositorio mediante `.gitignore`. Solo se versiona `.env.example`, con los nombres de las variables pero sin valores reales. Además, las respuestas de la API seleccionan explícitamente los campos a exponer (`attributes` en las consultas Sequelize), evitando filtrar información interna innecesaria.

- **¿Por qué se actualiza solo ciertos campos en `PUT`?** El endpoint de actualización arma dinámicamente un objeto `changes` solo con los campos que efectivamente llegaron en el `body`. Esto permite actualizaciones parciales (por ejemplo, cambiar solo el apellido) sin necesidad de reenviar todos los datos del usuario, y evita pisar campos existentes con `undefined` si el cliente no los envía.

- **¿Qué validaciones se aplicaron para evitar errores?** Se valida: (1) que el usuario/pedido exista antes de actualizar o eliminar (404 si no existe), (2) que un email no esté duplicado al crear o actualizar (400 si ya existe), (3) formato de email válido y campos no vacíos a nivel de modelo (validaciones de Sequelize), y (4) que el monto de un pedido sea mayor a 0.

- **¿Qué ventaja se encontró usando ORM frente a SQL manual?** Sequelize permite expresar relaciones (`include`) y transacciones sin escribir `JOIN`s ni sentencias `BEGIN/COMMIT/ROLLBACK` a mano, reduciendo la posibilidad de errores de sintaxis SQL. También aporta validaciones a nivel de modelo (antes de tocar la base), y hace el código más legible y mantenible al trabajar con objetos JavaScript en vez de resultados crudos de filas.

- **Relación 1:N Usuario–Pedidos**: se modeló `Usuario` como entidad principal y `Pedido` como entidad dependiente (`Pedido.belongsTo(User)` / `User.hasMany(Pedido)`), ya que un usuario puede realizar múltiples pedidos, pero cada pedido pertenece a un único usuario. Se usó `onDelete: "CASCADE"` para que, al eliminar un usuario, se eliminen también sus pedidos asociados y no queden registros huérfanos.

- **Transaccionalidad**: se implementó `POST /api/users/with-pedido`, que crea un usuario y su primer pedido en una única transacción de Sequelize. Si la creación del pedido falla (por ejemplo, monto inválido), se revierte también la creación del usuario (`rollback`), garantizando que nunca quede un usuario sin su pedido asociado a mitad de camino. Cada resultado (éxito o rollback) queda registrado en `logs/transactions.log`.

---

## 🌐 Rutas y ejemplos de uso

### Vistas (frontend)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Página principal. |
| GET | `/status` | Estado del servidor (JSON). |
| GET | `/users` | Listado de usuarios (HTML). |
| GET | `/users/add` | Formulario para crear un usuario. |
| GET | `/users/update/:id` | Formulario para editar un usuario existente. |

### API RESTful — Usuarios (`/api/users`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Lista todos los usuarios. Admite filtros: `?firstname=` y `?email=`. |
| GET | `/api/users/:id` | Devuelve un usuario por ID. |
| GET | `/api/users/email/:email` | Devuelve un usuario por email. |
| GET | `/api/users/:id/pedidos` | Devuelve un usuario junto a todos sus pedidos (relación, vía `include`). |
| POST | `/api/users` | Crea un nuevo usuario. |
| POST | `/api/users/with-pedido` | Crea un usuario y su primer pedido en una única transacción. |
| PUT | `/api/users/:id` | Actualiza (parcialmente) un usuario existente. |
| DELETE | `/api/users/:id` | Elimina un usuario (y sus pedidos, en cascada). |

### API RESTful — Pedidos (`/api/pedidos`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/pedidos` | Lista todos los pedidos, con los datos de su usuario incluidos. |
| GET | `/api/pedidos/:id` | Devuelve un pedido por ID. |
| POST | `/api/pedidos` | Crea un nuevo pedido asociado a un usuario existente. |
| PUT | `/api/pedidos/:id` | Actualiza un pedido. |
| DELETE | `/api/pedidos/:id` | Elimina un pedido. |

Todas las respuestas de la API siguen un formato consistente:
```json
{ "status": "ok" | "error", "message": "string", "data": {} | [] | null }
```

**Ejemplo — crear usuario + pedido en una transacción:**
```bash
curl -X POST http://localhost:3000/api/users/with-pedido \
  -H "Content-Type: application/json" \
  -d '{"firstname":"Carlos","lastname":"Diaz","email":"carlos@mail.com","descripcion":"Compra de notebook","monto":150000}'
```

**Ejemplo — usuario con sus pedidos:**
```bash
curl http://localhost:3000/api/users/<id>/pedidos
```

---

## ✅ Estado actual del desarrollo

### Parte 1 - Módulo 6 (completo)
- Servidor Express funcional, vistas dinámicas con Handlebars.
- Middleware `express.static()`, rutas públicas `/` y `/status`.
- Logging de accesos en `logs/log.txt`.

### Parte 2 - Módulo 7 (completo)
- Conexión estable a PostgreSQL vía Sequelize, con credenciales en `.env`.
- Modelos `User` y `Pedido`, relacionados 1:N.
- CRUD completo sobre ambas entidades, con validaciones y manejo de errores.
- Filtrado dinámico por query params en `GET /api/users`.
- Transacción atómica (`with-pedido`) con rollback verificado y logging en `logs/transactions.log`.
- Consulta combinada usuario + pedidos con `include`.

### Pendiente para la Parte 3 - Módulo 8
- Autenticación de usuarios (login/registro) con JWT.
- Rutas protegidas (públicas vs. privadas).
- Subida de archivos (imágenes de usuario) con validación de tipo y tamaño.

---

## 👤 Autor

Proyecto desarrollado por Diego Toro en el marco del programa Alkemy — Evaluación de los Módulos #6, #7 y #8.