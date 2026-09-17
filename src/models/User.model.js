import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "El nombre no puede estar vacío." } },
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "El apellido no puede estar vacío." } },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: { msg: "El email no tiene un formato válido." } },
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
    },
);

export default User;