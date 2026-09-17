import sequelize from "../config/database.js";
import User from "./User.model.js";
import Pedido from "./Pedido.model.js";

// Relación 1:N -> Un Usuario tiene muchos Pedidos, cada Pedido pertenece a un único Usuario.
User.hasMany(Pedido, {
    foreignKey: "userId",
    as: "pedidos",
    onDelete: "CASCADE",
});
Pedido.belongsTo(User, {
    foreignKey: "userId",
    as: "usuario",
});


export const syncModels = async () => {
    await sequelize.sync({ alter: true });
};

export { sequelize, User, Pedido };