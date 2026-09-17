import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";


class Pedido extends Model { }

Pedido.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "La descripción no puede estar vacía." } },
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: { args: [0.01], msg: "El monto debe ser mayor a 0." },
            },
        },
        estado: {
            type: DataTypes.STRING,
            defaultValue: "pendiente",
        },
    },
    {
        sequelize,
        modelName: "Pedido",
        tableName: "pedidos",
        timestamps: true,
    },
);

export default Pedido;