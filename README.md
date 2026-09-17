# ABP CRUD - Módulos 6, 7 y 8 (Node.js + Express + PostgreSQL + JWT)

Aplicación web backend desarrollada con **Node.js**, **Express** y **PostgreSQL** (vía **Sequelize**), correspondiente a las tres partes del proyecto integrador ABP. Implementa vistas dinámicas (Handlebars), una **API RESTful** completa para usuarios y pedidos, persistencia real en base de datos relacional, relaciones entre entidades, transacciones, **autenticación con JWT** y **subida de archivos**.

🔗 **Repositorio:** https://github.com/Nijiwax/Full-Stack-JS-Trainee---Proyecto-m6-m7-m8
🔗 **Google Drive:** https://drive.google.com/drive/folders/1CRdNJZRxabL6oAYPrpsqsRPP-AK9JVKo?usp=drive_link

---

## 📋 Requisitos del sistema

- **Node.js** v18 o superior (desarrollado y probado en v22).
- **npm** (incluido con Node.js).
- **PostgreSQL** (local o en la nube).

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
   Editar `.env`:
   ```
   PORT=3000
   DB_NAME=abp_m7
   DB_USER=postgres
   DB_PASSWORD=tu_password_real
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=una_clave_secreta_propia_larga_y_dificil_de_adivinar
   JWT_EXPIRES_IN=1h
   ```
   > ⚠️ El archivo `.env` **nunca** se sube al repositorio.

5. Ejecutar el servidor (ver sección **Ejecución**).

---

## ▶️ Ejecución

| Script | Comando | Descripción |
|---|---|---|
| `npm run dev` | `node --watch server.js --port 3001` | Modo desarrollo: reinicia el servidor automáticamente ante cambios en el código. |
| `npm start` | `node server.js` | Modo producción/estándar. |

Al iniciar, el servidor conecta a la base de datos, sincroniza los modelos y queda escuchando:
```
✅ Conexión a la base de datos establecida correctamente.
Servidor escuchando en http://localhost:3000
```

---

## 🔐 Autenticación (Módulo 8)

La API usa **JSON Web Tokens (JWT)** para proteger las operaciones que modifican datos. El flujo es:

### 1. Registrarse (público)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstname":"Ana","lastname":"Perez","email":"ana@mail.com","password":"secret123"}'
```

### 2. Iniciar sesión (público) — devuelve el token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@mail.com","password":"secret123"}'
```
Respuesta:
```json
{
  "status": "ok",
  "message": "Login exitoso.",
  "data": { "token": "eyJhbGciOi...", "user": { "id": "...", "firstname": "Ana", ... } }
}
```

### 3. Usar el token en rutas protegidas
Se envía en el header `Authorization`, con el prefijo `Bearer`:
```bash
curl -X DELETE http://localhost:3000/api/users/<id> \
  -H "Authorization: Bearer eyJhbGciOi..."
```

### ¿Dónde y cómo se almacena el token?
El servidor **no almacena** el token en ningún lado (los JWT son *stateless*: toda la información necesaria para validarlo viaja firmada dentro del propio token). Es responsabilidad del cliente guardarlo — en una app real de frontend normalmente se guarda en memoria o en `localStorage`/`sessionStorage` del navegador y se reenvía en cada request. En este proyecto, al no tener un frontend con login propio, el token se obtiene por Postman/curl y se pega manualmente en el header de cada request protegida.

### ¿Por qué se protegieron esas rutas?
Se dejaron **públicas** todas las operaciones de **lectura** (`GET`), ya que consultar usuarios o pedidos no representa un riesgo de integridad de datos. Se protegieron con JWT todas las operaciones que **crean, modifican o eliminan** información (`POST`, `PUT`, `DELETE`) y la **subida de archivos**, porque son las que pueden alterar el estado del sistema y no deberían estar disponibles para cualquiera sin autenticarse. El alta de un usuario nuevo (`/api/auth/register`) es la única excepción pública entre las mutaciones, porque es el punto de entrada natural para que alguien nuevo pueda crear su cuenta.

### Rutas públicas vs. privadas

| Ruta | Método | Acceso |
|---|---|---|
| `/api/auth/register` | POST | Público |
| `/api/auth/login` | POST | Público |
| `/api/users` | GET | Público |
| `/api/users/:id` | GET | Público |
| `/api/users/email/:email` | GET | Público |
| `/api/users/:id/pedidos` | GET | Público |
| `/api/users` | POST | 🔒 Privado |
| `/api/users/with-pedido` | POST | 🔒 Privado |
| `/api/users/:id` | PUT | 🔒 Privado |
| `/api/users/:id` | DELETE | 🔒 Privado |
| `/api/users/:id/avatar` | POST | 🔒 Privado |
| `/api/pedidos` | GET | Público |
| `/api/pedidos/:id` | GET | Público |
| `/api/pedidos` | POST | 🔒 Privado |
| `/api/pedidos/:id` | PUT | 🔒 Privado |
| `/api/pedidos/:id` | DELETE | 🔒 Privado |

---

## 📤 Subida de archivos (avatar de usuario)

```bash
curl -X POST http://localhost:3000/api/users/<id>/avatar \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@/ruta/a/mi/foto.jpg"
```

- El campo del form-data debe llamarse **`avatar`**.
- Tipos permitidos: `image/jpeg`, `image/png`, `image/webp`.
- Tamaño máximo: **2 MB**.
- El archivo queda guardado en `uploads/` y accesible públicamente en `http://localhost:3000/uploads/<nombre-archivo>`.
- El campo `avatar` del usuario en la base de datos queda actualizado con esa ruta (PLUS: asociación con la base de datos).

---

## 📂 Estructura del proyecto

```
preparacion-abp-m6/
├── server.js
├── package.json
├── .env.example
├── .env                              # NO se sube al repo
├── uploads/                          # Archivos subidos (avatares) - contenido ignorado por git
├── logs/
│   ├── log.txt
│   └── transactions.log
├── public/
│   └── assets/js/addUser.js
└── src/
    ├── app.js
    ├── config/
    │   └── database.js
    ├── controllers/
    │   ├── auth.controllers.js       # Nuevo (Módulo 8)
    │   ├── users.controllers.js
    │   ├── pedidos.controllers.js
    │   ├── status.controller.js
    │   └── views.controllers.js
    ├── middlewares/
    │   ├── auth.middleware.js        # Nuevo (Módulo 8): verificación de JWT
    │   ├── upload.middleware.js      # Nuevo (Módulo 8): configuración de Multer
    │   ├── validate_body.js
    │   └── logger.js
    ├── models/
    │   ├── index.js
    │   ├── User.model.js             # + password, avatar (Módulo 8)
    │   └── Pedido.model.js
    ├── services/
    │   ├── auth.service.js           # Nuevo (Módulo 8)
    │   ├── user.service.js
    │   └── pedido.service.js
    ├── routes/
    │   ├── auth.routes.js            # Nuevo (Módulo 8)
    │   ├── users.routes.js
    │   ├── pedidos.routes.js
    │   └── views.routes.js
    ├── utils/
    │   ├── utils.js
    │   └── transactionLogger.js
    └── views/
```

---

## 🧠 Justificación de decisiones técnicas

### Módulo 8

- **¿Cómo se separaron rutas y controladores?** Se mantuvo el mismo patrón de los módulos anteriores: `routes/` solo define el mapeo verbo HTTP + path + middlewares aplicados, sin lógica; `controllers/` maneja la validación de la request y el formato de la respuesta; `services/` concentra la lógica de negocio y el acceso a la base de datos. Para el Módulo 8 se sumó `auth.service.js` y `auth.controllers.js` siguiendo la misma separación, y `auth.middleware.js` como pieza independiente y reutilizable en cualquier ruta que necesite protección.

- **¿Qué validaciones se realizaron antes de insertar/modificar datos?** En el registro: password de al menos 6 caracteres, email único (ya existente desde el Módulo 7), formato de email válido a nivel de modelo. En el login: se verifica que el usuario exista y que el password coincida con el hash almacenado (usando `bcrypt.compare`), devolviendo siempre el mismo mensaje genérico ("Credenciales inválidas") tanto si el email no existe como si el password es incorrecto, para no revelar si un email está o no registrado.

- **¿Por qué se protegieron esas rutas?** Ver la sección "🔐 Autenticación" más arriba: se protegieron todas las mutaciones (crear/actualizar/eliminar) y la subida de archivos, dejando las lecturas y el registro/login públicos.

- **¿Dónde y cómo se almacena el token?** Ver también la sección de autenticación: el servidor no lo almacena (JWT es *stateless*); es responsabilidad del cliente guardarlo y reenviarlo en cada request protegida vía el header `Authorization: Bearer <token>`.

- **¿Por qué Multer para la subida de archivos?** Es la librería estándar del ecosistema Express para manejar `multipart/form-data`, con soporte nativo para definir el destino de guardado, renombrar archivos, y validar tipo (`fileFilter`) y tamaño (`limits.fileSize`) antes de persistir nada en disco.

- **¿Por qué se asoció el avatar al usuario en la base de datos (PLUS)?** Para que la subida no sea un archivo "huérfano": el campo `avatar` en el modelo `User` guarda la ruta pública del archivo, de forma que cualquier consulta a ese usuario (`GET /api/users/:id`) ya devuelve la URL de su avatar sin necesidad de una consulta adicional.

---

## 🌐 Rutas y ejemplos de uso

### API RESTful — Autenticación (`/api/auth`)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registra un nuevo usuario (con password). |
| POST | `/api/auth/login` | Público | Login, devuelve un JWT. |

### API RESTful — Usuarios (`/api/users`)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/users` | Público | Lista usuarios. Admite `?firstname=` y `?email=`. |
| GET | `/api/users/:id` | Público | Usuario por ID. |
| GET | `/api/users/email/:email` | Público | Usuario por email. |
| GET | `/api/users/:id/pedidos` | Público | Usuario + sus pedidos (relación). |
| POST | `/api/users` | 🔒 Privado | Crea un usuario (uso administrativo). |
| POST | `/api/users/with-pedido` | 🔒 Privado | Crea usuario + pedido en una transacción. |
| PUT | `/api/users/:id` | 🔒 Privado | Actualiza (parcialmente) un usuario. |
| DELETE | `/api/users/:id` | 🔒 Privado | Elimina un usuario (y sus pedidos, en cascada). |
| POST | `/api/users/:id/avatar` | 🔒 Privado | Sube y asocia el avatar del usuario. |

### API RESTful — Pedidos (`/api/pedidos`)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/pedidos` | Público | Lista pedidos, con su usuario incluido. |
| GET | `/api/pedidos/:id` | Público | Pedido por ID. |
| POST | `/api/pedidos` | 🔒 Privado | Crea un pedido asociado a un usuario. |
| PUT | `/api/pedidos/:id` | 🔒 Privado | Actualiza un pedido. |
| DELETE | `/api/pedidos/:id` | 🔒 Privado | Elimina un pedido. |

Todas las respuestas siguen el formato:
```json
{ "status": "ok" | "error", "message": "string", "data": {} | [] | null }
```

---

## ✅ Estado del desarrollo — Proyecto completo

### Parte 1 - Módulo 6 ✅
Servidor Express, vistas Handlebars, rutas públicas, persistencia en archivo plano (`log.txt`).

### Parte 2 - Módulo 7 ✅
PostgreSQL + Sequelize, relación 1:N Usuario-Pedidos, CRUD completo, transacciones con rollback, filtrado dinámico.

### Parte 3 - Módulo 8 ✅
Autenticación con JWT (registro/login), rutas públicas y privadas, subida de archivos con Multer (tipo y tamaño validados), avatar asociado a la base de datos.

---

## 🔄 Reflexión: integración de los 3 módulos

El proyecto se construyó de forma incremental, y cada módulo se apoyó directamente sobre el anterior sin reescribir lo ya hecho:

- La **estructura modular** (`routes/controllers/middlewares/services`) definida desde el Módulo 6 se mantuvo intacta y sirvió como esqueleto para sumar cada nueva pieza (los servicios de auth y las rutas de pedidos encajaron en el mismo patrón).
- La **persistencia en archivo plano** del Módulo 6 (`log.txt`) convive con la persistencia en base de datos real del Módulo 7 — de hecho, el logging de transacciones del Módulo 7 (`transactions.log`) reutiliza el mismo enfoque de `fs.appendFile()`.
- El modelo `User` creado en el Módulo 7 se **extendió** en el Módulo 8 (agregando `password` y `avatar`) en vez de crear un modelo nuevo, evitando duplicar lógica de negocio ya validada.
- La capa de `services/` introducida en el Módulo 7 para separar lógica de negocio de los controladores fue la que permitió sumar `auth.service.js` en el Módulo 8 sin tocar la forma en que ya funcionaban `user.service.js` y `pedido.service.js`.
- El formato de respuesta consistente `{status, message, data}`, adoptado ya desde el Módulo 7 pensando en el Módulo 8, se mantuvo sin cambios en los nuevos endpoints de autenticación y subida de archivos.

El resultado es un backend donde cada entrega fue una capa adicional sobre una base estable, en vez de tres partes desconectadas.

---

## 👤 Autor

Proyecto desarrollado por Diego Toro en el marco del programa Alkemy — Evaluación de los Módulos #6, #7 y #8.