# ABP CRUD - Módulo 6 (Node.js + Express)

🔗 **Repositorio:** https://github.com/Nijiwax/Full-Stack-JS-Trainee---Proyecto-m6-m7-m8

Aplicación web backend desarrollada con **Node.js** y **Express**, correspondiente a la **Parte 1 (Módulo 6)** del proyecto integrador ABP. Implementa un servidor con vistas dinámicas (Handlebars), una API RESTful para la gestión de usuarios y persistencia de datos mediante archivos planos (JSON).

---

## 📋 Requisitos del sistema

- **Node.js** v18 o superior (desarrollado y probado en v22).
- **npm** (incluido con Node.js).
- No requiere base de datos externa en esta etapa: los datos se persisten en un archivo JSON local (`src/data/users.json`).

---

## ⚙️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd preparacion-abp-m6
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Ejecutar el servidor (ver sección **Ejecución**).

---

## ▶️ Ejecución

El proyecto expone dos scripts en `package.json`:

| Script | Comando | Descripción |
|---|---|---|
| `npm run dev` | `node --watch server.js --port 3001` | Modo desarrollo: reinicia el servidor automáticamente ante cambios en el código, en el puerto `3001`. |
| `npm start` | `node server.js` | Modo producción/estándar: levanta el servidor en el puerto por defecto (`3000`), sin reinicio automático. |

También se puede indicar el puerto manualmente al ejecutar el servidor, gracias a `yargs`:

```bash
node server.js --port 3005
# o su forma corta
node server.js -p 3005
```

> El puerto debe estar en el rango **3000-3010**; si se indica un valor fuera de rango o no numérico, el servidor no arranca e informa el error por consola.

Una vez iniciado, el servidor queda disponible en:
```
http://localhost:<puerto>
```

---

## 📂 Estructura del proyecto

```
preparacion-abp-m6/
├── server.js                      # Punto de entrada: parsea el puerto y levanta el servidor
├── package.json
├── logs/
│   └── log.txt                    # Registro de accesos (fecha, hora, ruta) - se genera automáticamente
├── public/                        # Archivos estáticos servidos por Express
│   └── assets/
│       ├── css/
│       ├── img/
│       └── js/
│           └── addUser.js         # Lógica de frontend para el alta de usuarios
└── src/
    ├── app.js                     # Configuración de Express, Handlebars y montaje de rutas
    ├── data/
    │   └── users.json             # Persistencia de usuarios en archivo plano
    ├── controllers/
    │   ├── users.controllers.js   # Lógica de la API de usuarios
    │   ├── views.controllers.js   # Lógica de renderizado de vistas
    │   └── status.controller.js   # Lógica de la ruta /status
    ├── middlewares/
    │   ├── validate_body.js       # Validación básica del body en las requests
    │   └── logger.js              # Middleware de logging de accesos
    ├── models/
    │   └── User.model.js          # Modelo de usuario (CRUD sobre users.json)
    ├── routes/
    │   ├── users.routes.js        # Rutas de la API REST (/api/users)
    │   └── views.routes.js        # Rutas de las vistas (/, /status, /users, etc.)
    ├── utils/
    │   └── utils.js                # Helpers de lectura/escritura de JSON
    └── views/                      # Plantillas Handlebars (layout, partials y vistas)
---

## 🧠 Justificación de decisiones técnicas

- **Nombre del archivo principal (`server.js` + `src/app.js`)**: en lugar de un único `index.js`, se separó la **configuración de la aplicación** (`src/app.js`, donde se define Express, Handlebars y las rutas) del **arranque del servidor** (`server.js`, donde se resuelve el puerto y se llama a `app.listen()`). Esta separación es una convención común en Express que facilita testear `app` de forma aislada sin necesariamente levantar un puerto real.

- **`node --watch` en vez de `nodemon`**: se optó por la bandera nativa `--watch` de Node.js (disponible desde Node 18+) para el modo desarrollo, evitando sumar una dependencia externa (`nodemon`) cuando Node ya resuelve esa necesidad de forma built-in.

- **`yargs` en vez de `dotenv` para el puerto**: en lugar de fijar el puerto mediante una variable de entorno en un archivo `.env`, se implementó `yargs` para leerlo como argumento de línea de comandos (`--port` / `-p`), con **validación automática de rango** (3000-3010) y un valor por defecto. Esto permite cambiar el puerto sin necesidad de crear o editar archivos adicionales, aunque implica que no hay variables de entorno configuradas todavía (pendiente si el proyecto lo requiere en etapas futuras, por ejemplo para credenciales de base de datos).

- **Carpetas adicionales (`models`, `utils`, `data`)**: además de las carpetas base sugeridas (`routes`, `controllers`, `middlewares`, `public`), se agregaron:
  - `models/`: para encapsular la lógica de datos del usuario (patrón Active Record simplificado), anticipando el reemplazo de la persistencia en JSON por un ORM real en el Módulo 7.
  - `utils/`: funciones reutilizables de lectura/escritura de archivos JSON, para no repetir lógica de `fs` en los modelos.
  - `data/`: contiene el archivo `users.json` que actúa como base de datos temporal.

- **Motor de plantillas (Handlebars)**: se decidió usar `express-handlebars` en vez de servir únicamente contenido estático desde `/public`, para poder renderizar vistas dinámicas (listado de usuarios, formularios de alta/edición) con datos reales provenientes del backend. `/public` se sigue utilizando para servir el JavaScript de frontend (`addUser.js`) y queda preparado para sumar CSS e imágenes propias más adelante.

---

## 🌐 Rutas y ejemplos de uso

### Vistas (frontend)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Página principal. |
| GET | `/users` | Listado de usuarios (HTML). |
| GET | `/users/add` | Formulario para crear un usuario. |
| GET | `/users/update/:id` | Formulario para editar un usuario existente. |

### API RESTful (`/api/users`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Devuelve todos los usuarios (JSON). |
| GET | `/api/users/:id` | Devuelve un usuario por ID. |
| GET | `/api/users/email/:email` | Devuelve un usuario por email. |
| POST | `/api/users` | Crea un nuevo usuario. |
| PUT | `/api/users/:id` | Actualiza un usuario existente. |
| DELETE | `/api/users/:id` | Elimina un usuario. |

**Ejemplo — crear un usuario:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstname":"Ana","lastname":"Perez","email":"ana.perez@mail.com"}'
```

**Respuesta esperada:**
```json
{
  "message": "Usuario creado con éxito",
  "user": {
    "firstname": "Ana",
    "lastname": "Perez",
    "email": "ana.perez@mail.com",
    "id": "generado-automáticamente"
  }
}
```

**Ejemplo — listar usuarios:**
```bash
curl http://localhost:3000/api/users
```

**Ejemplo — eliminar un usuario:**
```bash
curl -X DELETE http://localhost:3000/api/users/<id>
```

Todas las respuestas de error siguen un formato consistente:
```json
{ "message": "Descripción del error" }
```

---

## ✅ Estado actual del desarrollo (Parte 1 - Módulo 6)

Implementado:
- Servidor Express funcional con arranque configurable por puerto.
- Vistas dinámicas con Handlebars (layout + partials + vistas).
- Middleware `express.static()` para servir archivos desde `/public`.
- CRUD completo de usuarios persistido en archivo plano (`users.json`).
- Validación básica de datos y manejo de errores en la API.
- Rutas modularizadas mediante `express.Router()` y conectadas con `app.use()`.
- Ruta pública `/status`, que devuelve en JSON el estado del servidor (uptime y timestamp).
- Middleware global de logging (`src/middlewares/logger.js`): registra cada request en `logs/log.txt` con formato `[fecha hora] MÉTODO ruta`, usando `fs.appendFile()`. La carpeta `logs/` y el archivo se crean automáticamente al iniciar el servidor si no existen.

Pendiente para próximas iteraciones:
- Variables de entorno (`dotenv`) si se requieren para configuración sensible.
- Integración con base de datos real (PostgreSQL/MongoDB) y ORM — **Módulo 7**.
- Autenticación con JWT y subida de archivos — **Módulo 8**.
---

## 👤 Autor

Proyecto desarrollado por Diego Toro en el marco del programa Alkemy — Evaluación de los Módulos #6, #7 y #8.
