import * as pedidoService from "../services/pedido.service.js";
import chalk from "chalk";

const log = {
    error: (msg) => console.log(chalk.red(msg)),
};

export const findAll = async (req, res) => {
    try {
        const pedidos = await pedidoService.getAllPedidos();
        res.json({ status: "ok", message: "Pedidos obtenidos con éxito.", data: pedidos });
    } catch (error) {
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar obtener los pedidos.",
            data: null,
        });
    }
};

export const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await pedidoService.getPedidoById(id);

        if (!pedido) {
            return res
                .status(404)
                .json({ status: "error", message: "Pedido no encontrado.", data: null });
        }

        res.json({ status: "ok", message: "Pedido encontrado.", data: pedido });
    } catch (error) {
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar obtener el pedido.",
            data: null,
        });
    }
};

export const create = async (req, res) => {
    try {
        const { descripcion, monto, userId } = req.body;

        if (!descripcion || !userId) {
            return res.status(400).json({
                status: "error",
                message: "Se requiere descripcion y userId.",
                data: null,
            });
        }

        const pedido = await pedidoService.createPedido({ descripcion, monto, userId });

        res.status(201).json({
            status: "ok",
            message: "Pedido creado con éxito.",
            data: pedido,
        });
    } catch (error) {
        if (error.code) {
            return res
                .status(error.code)
                .json({ status: "error", message: error.message, data: null });
        }
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar crear el pedido.",
            data: null,
        });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, monto, estado } = req.body;

        const changes = {};
        if (descripcion) changes.descripcion = descripcion;
        if (monto) changes.monto = monto;
        if (estado) changes.estado = estado;

        const pedido = await pedidoService.updatePedido(id, changes);

        res.json({
            status: "ok",
            message: "Pedido actualizado con éxito.",
            data: pedido,
        });
    } catch (error) {
        if (error.code) {
            return res
                .status(error.code)
                .json({ status: "error", message: error.message, data: null });
        }
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar actualizar el pedido.",
            data: null,
        });
    }
};

export const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        await pedidoService.deletePedido(id);

        res.json({ status: "ok", message: "Pedido eliminado con éxito.", data: null });
    } catch (error) {
        if (error.code) {
            return res
                .status(error.code)
                .json({ status: "error", message: error.message, data: null });
        }
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar eliminar el pedido.",
            data: null,
        });
    }
};