import * as userService from "../services/user.service.js";

// VISTA HOME
export const homeView = (req, res) => {
    try {
        res.render("home");
    } catch (error) {
        res.status(500).send("Error en cargar vista...");
    }
};

export const usersView = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.render("listUsers", {
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en cargar vista...");
    }
};

export const usersAddView = (req, res) => {
    try {
        res.render("addUsers");
    } catch (error) {
        res.status(500).send("Error en cargar vista...");
    }
};

export const usersUpdateView = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        res.render("updateUser", {
            user,
            id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en cargar vista...");
    }
};