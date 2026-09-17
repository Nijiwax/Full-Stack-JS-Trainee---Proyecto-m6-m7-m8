import { Pedido, User } from "../models/index.js";

export const getAllPedidos = async () => {
    const pedidos = await Pedido.findAll({
        include: [
            { association: "usuario", attributes: ["id", "firstname", "lastname", "email"] },
        ],
        order: [["createdAt", "DESC"]],
    });
    return pedidos.map((p) => p.get({ plain: true }));
};

export const getPedidoById = async (id) => {
    const pedido = await Pedido.findByPk(id, {
        include: [
            { association: "usuario", attributes: ["id", "firstname", "lastname", "email"] },
        ],
    });
    return pedido ? pedido.get({ plain: true }) : null;
};

export const createPedido = async ({ descripcion, monto, userId }) => {
    const user = await User.findByPk(userId);

    if (!user) {
        const error = new Error("El usuario indicado no existe.");
        error.code = 404;
        throw error;
    }

    if (!monto || Number(monto) <= 0) {
        const error = new Error("El monto debe ser mayor a 0.");
        error.code = 400;
        throw error;
    }

    const pedido = await Pedido.create({ descripcion, monto, userId });
    return pedido.get({ plain: true });
};

export const updatePedido = async (id, changes) => {
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
        const error = new Error("El pedido indicado no existe.");
        error.code = 404;
        throw error;
    }

    await pedido.update(changes);
    return pedido.get({ plain: true });
};

export const deletePedido = async (id) => {
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
        const error = new Error("El pedido indicado no existe.");
        error.code = 404;
        throw error;
    }

    await pedido.destroy();
    return true;
};