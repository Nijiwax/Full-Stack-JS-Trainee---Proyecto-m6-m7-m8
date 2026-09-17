import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize, User, Pedido } from "../models/index.js";
import { logTransaction } from "../utils/transactionLogger.js";

// Campos que se exponen en las respuestas (se excluyen datos que no correspondan mostrar, como "password")
const PUBLIC_ATTRIBUTES = ["id", "firstname", "lastname", "email", "avatar", "createdAt", "updatedAt"];

export const getAllUsers = async (filters = {}) => {
    const where = {};

    if (filters.firstname) {
        where.firstname = { [Op.iLike]: `%${filters.firstname}%` };
    }
    if (filters.email) {
        where.email = { [Op.iLike]: `%${filters.email}%` };
    }

    const users = await User.findAll({
        where,
        attributes: PUBLIC_ATTRIBUTES,
        order: [["createdAt", "DESC"]],
    });

    return users.map((u) => u.get({ plain: true }));
};

export const getUserById = async (id) => {
    const user = await User.findByPk(id, { attributes: PUBLIC_ATTRIBUTES });
    return user ? user.get({ plain: true }) : null;
};

export const getUserByEmail = async (email) => {
    const user = await User.findOne({
        where: { email: email.toLowerCase().trim() },
        attributes: PUBLIC_ATTRIBUTES,
    });
    return user ? user.get({ plain: true }) : null;
};

// Uso exclusivo del login: incluye el hash del password para poder compararlo.
// Nunca se expone directamente en una respuesta HTTP.
export const getUserByEmailForAuth = async (email) => {
    return User.findOne({ where: { email: email.toLowerCase().trim() } });
};

// Módulo 8 (PLUS): asocia el archivo subido (avatar) a un usuario existente
export const updateAvatar = async (id, avatarPath) => {
    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error("No puede subir un avatar para un usuario que no existe.");
        error.code = 404;
        throw error;
    }

    await user.update({ avatar: avatarPath });
    const plainUser = user.get({ plain: true });
    delete plainUser.password;
    return plainUser;
};

// Requisito Lección 6: usuario junto con todos sus pedidos, en una sola consulta (include)
export const getUserWithPedidos = async (id) => {
    const user = await User.findByPk(id, {
        attributes: PUBLIC_ATTRIBUTES,
        include: [{ association: "pedidos" }],
    });
    return user ? user.get({ plain: true }) : null;
};

export const createUser = async ({ firstname, lastname, email, password }) => {
    const exists = await User.findOne({ where: { email } });

    if (exists) {
        const error = new Error("Ya existe un usuario registrado con el email: " + email);
        error.code = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstname, lastname, email, password: hashedPassword });

    const plainUser = user.get({ plain: true });
    delete plainUser.password;
    return plainUser;
};

export const updateUser = async (id, changes) => {
    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error(
            "No puede actualizar un usuario que no existe en la base de datos.",
        );
        error.code = 404;
        throw error;
    }

    if (changes.email && changes.email !== user.email) {
        const emailOwner = await User.findOne({ where: { email: changes.email } });
        if (emailOwner) {
            const error = new Error(
                "El correo que intenta actualizar pertenece a otro usuario.",
            );
            error.code = 400;
            throw error;
        }
    }

    await user.update(changes);
    return user.get({ plain: true });
};

export const deleteUser = async (id) => {
    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error(
            "No puede eliminar un usuario que no existe en la base de datos.",
        );
        error.code = 404;
        throw error;
    }

    await user.destroy();
    return true;
};

/**
 * Requisito Lección 4 (Transaccionalidad): crea un usuario junto con su primer
 * pedido en una sola transacción atómica. Si la creación del pedido falla
 * (por ejemplo, monto inválido), se revierte también la creación del usuario.
 */
export const createUserWithPedido = async (userData, pedidoData) => {
    const t = await sequelize.transaction();

    try {
        const exists = await User.findOne({
            where: { email: userData.email },
            transaction: t,
        });

        if (exists) {
            const error = new Error("Ya existe un usuario registrado con ese email.");
            error.code = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create(
            { ...userData, password: hashedPassword },
            { transaction: t },
        );

        if (!pedidoData.monto || Number(pedidoData.monto) <= 0) {
            throw new Error("El monto del pedido debe ser mayor a 0.");
        }

        const pedido = await Pedido.create(
            { ...pedidoData, userId: user.id },
            { transaction: t },
        );

        await t.commit();

        logTransaction(
            "success",
            `Usuario "${user.email}" creado junto a pedido "${pedido.id}" por $${pedido.monto}.`,
        );

        const plainUser = user.get({ plain: true });
        delete plainUser.password;

        return { user: plainUser, pedido: pedido.get({ plain: true }) };
    } catch (error) {
        await t.rollback();

        logTransaction(
            "rollback",
            `Falló la creación de usuario + pedido (email: ${userData.email}): ${error.message}`,
        );

        throw error;
    }
};