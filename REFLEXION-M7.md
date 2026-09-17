Reflexión técnica — Parte 2 (Módulo 7)
Conexión a la base de datos

Elegí Sequelize como ORM, apoyado sobre el driver pg, porque es el stack más usado en el ecosistema Node + PostgreSQL y porque permite trabajar con modelos, relaciones y transacciones de forma declarativa, sin tener que escribir sentencias SQL a mano para cada operación.

Las credenciales de conexión (usuario, contraseña, host, puerto y nombre de base) se manejan exclusivamente a través de variables de entorno (.env), que está excluido del repositorio mediante .gitignore. Lo único que se sube al repo es .env.example, con los nombres de las variables pero sin ningún valor real, para que cualquier persona que clone el proyecto sepa qué datos tiene que completar.

Lectura y filtrado de datos

GET /api/users devuelve los usuarios en formato JSON, seleccionando explícitamente qué columnas exponer (attributes), en vez de devolver el registro completo tal cual está en la base. Sumé un filtro dinámico opcional por ?firstname= y ?email= usando Op.iLike de Sequelize, que arma la condición WHERE solo si el query param fue enviado.

Actualización y eliminación

En PUT /api/users/:id decidí actualizar solo los campos que llegan en el body, en vez de exigir el objeto completo. Esto evita que, por ejemplo, si el usuario solo quiere cambiar su apellido, tenga que reenviar también el nombre y el email (y evita pisarlos accidentalmente con undefined).

Antes de actualizar o eliminar, siempre se valida que el registro exista (findByPk); si no existe, se responde con un 404 y un mensaje claro, en vez de dejar que la operación falle silenciosamente o con un error genérico.

Transaccionalidad

Implementé POST /api/users/with-pedido, que crea un usuario y su primer pedido en una única transacción de Sequelize (sequelize.transaction()). Si la creación del pedido falla —por ejemplo, si el monto es menor o igual a 0— se revierte también la creación del usuario, así nunca queda un usuario "huérfano" sin su pedido inicial. Probé esto forzando un monto negativo y confirmando que el usuario no quedaba en la base. Cada resultado (éxito o rollback) se registra en logs/transactions.log, con fecha, estado y detalle.

ORM vs. SQL manual

La principal ventaja que encontré usando Sequelize frente a escribir SQL a mano fue en las relaciones: en vez de escribir un JOIN manual para traer un usuario con sus pedidos, alcanza con include: [{ association: "pedidos" }]. Lo mismo con las transacciones: no tuve que escribir BEGIN / COMMIT / ROLLBACK explícitamente, sino que Sequelize expone una API que encapsula ese manejo y reduce el margen de error. Como contraparte, hay menos control fino sobre la consulta SQL exacta que se ejecuta, aunque para el alcance de este proyecto no fue un problema.

Relación entre entidades

Modelé Usuario y Pedido con una relación 1:N: un usuario puede tener muchos pedidos, pero cada pedido pertenece a un único usuario (User.hasMany(Pedido) / Pedido.belongsTo(User)). Configuré onDelete: "CASCADE" para que, al eliminar un usuario, se eliminen también sus pedidos asociados automáticamente, evitando registros huérfanos en la tabla pedidos.