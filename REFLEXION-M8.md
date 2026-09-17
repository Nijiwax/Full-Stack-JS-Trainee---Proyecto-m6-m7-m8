# Reflexión técnica — Parte 3 (Módulo 8)

## Separación de rutas y controladores

Mantuve el mismo patrón que veníamos usando desde el Módulo 7: `routes/`
solo define qué verbo HTTP y qué path dispara qué controlador (y qué
middlewares se aplican antes), sin ninguna lógica de negocio. `controllers/`
se encarga de leer la request, validar lo mínimo indispensable, y devolver
la respuesta en el formato consistente `{status, message, data}`.
`services/` concentra toda la lógica real (consultas, validaciones de
negocio, hashing de contraseñas, generación de tokens). Para este módulo
sumé `auth.service.js` y `auth.controllers.js` siguiendo exactamente esa
misma separación, en vez de mezclar la lógica de autenticación dentro del
controller de usuarios.

## Validaciones antes de insertar o modificar datos

En el registro (`POST /api/auth/register`) valido que la contraseña tenga
al menos 6 caracteres, y reutilizo la validación de email único que ya
existía desde el Módulo 7. En el login (`POST /api/auth/login`) comparo el
password recibido contra el hash guardado con `bcrypt.compare()`, y
devuelvo siempre el mismo mensaje genérico ("Credenciales inválidas") sin
importar si falló porque el email no existe o porque el password está mal.
Esto es a propósito: si el mensaje fuera distinto en cada caso, cualquiera
podría usar el login para averiguar qué emails están registrados en el
sistema, probando direcciones al azar.

## Por qué protegí esas rutas

Dejé públicas todas las lecturas (`GET`) porque consultar usuarios o
pedidos no compromete la integridad de los datos. Protegí con JWT todo lo
que crea, modifica o elimina información (`POST`, `PUT`, `DELETE`) y
también la subida de archivos, porque esas son las operaciones que
efectivamente cambian el estado del sistema. La única mutación que dejé
pública fue el registro de usuarios nuevos, porque tiene que poder acceder
alguien que todavía no tiene cuenta.

## Dónde y cómo se almacena el token

El servidor no guarda el token en ningún lado — los JWT son *stateless*:
toda la información que se necesita para validarlos (usuario, fecha de
emisión, fecha de expiración) viaja firmada dentro del propio token, y el
servidor solo necesita su clave secreta (`JWT_SECRET`) para verificar esa
firma en cada request. Guardar el token es responsabilidad del cliente. En
una aplicación con frontend real, normalmente se guardaría en memoria o en
`localStorage` del navegador, reenviándolo en el header `Authorization` de
cada petición protegida. Como este proyecto no tiene un frontend con login
propio, el token se obtiene manualmente desde Postman o curl y se pega en
el header de cada prueba.

## Multer para subida de archivos

Elegí Multer porque es la librería estándar del ecosistema Express para
manejar formularios `multipart/form-data` (necesarios para subir
archivos). Permite definir dónde guardar los archivos, cómo nombrarlos, y
sobre todo validar el tipo (`fileFilter`) y el tamaño (`limits.fileSize`)
*antes* de que el archivo llegue a guardarse en disco, rechazando de forma
temprana cualquier archivo que no sea una imagen o que supere los 2 MB.

## Asociación del avatar con la base de datos

En vez de dejar la subida de archivos como un endpoint aislado que solo
guarda el archivo en `uploads/`, decidí asociar la ruta del archivo subido
al registro del usuario correspondiente (`user.avatar`), aprovechando la
tarea PLUS de la consigna. Esto hace que el archivo no quede "huérfano":
cualquier consulta a `GET /api/users/:id` ya devuelve la URL del avatar sin
necesidad de una consulta extra.

## Cómo se integraron los aprendizajes de los 3 módulos

Cada módulo se construyó como una capa adicional sobre el anterior, sin
descartar nada de lo ya hecho:

- La estructura modular definida en el Módulo 6 (rutas, controladores,
  middlewares) fue la base que permitió, en el Módulo 7, simplemente sumar
  una carpeta `services/` sin reorganizar todo lo anterior; y en el Módulo
  8, sumar `auth.service.js` siguiendo exactamente el mismo patrón.
- La persistencia en archivo plano del Módulo 6 (`log.txt`) no desapareció
  al sumar PostgreSQL en el Módulo 7: convive con la base de datos, y hasta
  se reutilizó el mismo enfoque (`fs.appendFile()`) para el log de
  transacciones (`transactions.log`).
- El modelo `User` que armé en el Módulo 7 con Sequelize se extendió en el
  Módulo 8 agregándole los campos `password` y `avatar`, en vez de crear un
  modelo nuevo separado — evitando duplicar toda la lógica de validaciones
  y relaciones que ya tenía.
- El formato de respuesta `{status, message, data}` que adopté en el Módulo
  7 (pensando ya en que el Módulo 8 iba a pedirlo explícitamente) se
  mantuvo sin cambios en los endpoints nuevos de autenticación y subida de
  archivos, dándole consistencia a toda la API de punta a punta.

El resultado es un único backend que fue creciendo en funcionalidad en cada
entrega, en vez de tres proyectos independientes pegados al final.