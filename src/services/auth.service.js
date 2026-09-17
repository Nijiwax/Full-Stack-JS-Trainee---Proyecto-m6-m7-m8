import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userService from "./user.service.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const register = async ({ firstname, lastname, email, password }) => {
    if (!password || password.length < 6) {
        const error = new Error("La contraseña debe tener al menos 6 caracteres.");
        error.code = 400;
        throw error;
    }

    const user = await userService.createUser({ firstname, lastname, email, password });
    return user;
};

export const login = async ({ email, password }) => {
    const user = await userService.getUserByEmailForAuth(email);

    if (!user) {
        const error = new Error("Credenciales inválidas.");
        error.code = 401;
        throw error;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        const error = new Error("Credenciales inválidas.");
        error.code = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
    );

    const plainUser = user.get({ plain: true });
    delete plainUser.password;

    return { token, user: plainUser };
};