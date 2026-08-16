import User from "../models/User.model.js";
import chalk from "chalk";

const log = {
    error: (msg) => console.log(chalk.red(msg))
}

export const findAll = (req, res) => {
    try {
        const users = User.findAll();

        res.json({ users });
    } catch (error) {
        log.error(error.message);
        res.status(500).json({
            message:
                "Error al intentar obtener los datos de los usuarios, intente más tarde...",
        });
    }
};

export const findById = (req, res) => {
    try {
        let { id } = req.params;
        const usuario = User.findById(id);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar obtener el usuario, intente más tarde.",
        });
    }
};

export const findByEmail = (req, res) => {
    try {
        let { email } = req.params;
        const usuario = User.findByEmail(email);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar obtener el usuario, intente más tarde.",
        });
    }
};

export const create = (req, res) => {
    try {

        let { firstname, lastname, email } = req.body;

        if (!firstname || !lastname || !email) {
            return res
                .status(400)
                .json({
                    message: "No se proporciona todos los campos requeridos.",
                });
        }

        const newUser = new User(firstname, lastname, email);

        newUser.save();

        res.status(201).json({message: "Usuario creado con éxito", user: newUser});
    } catch (error) {
        
        if(error.code){
            return res.status(error.code).json({message: error.message});
        }
        res.status(500).json({message: "Error al intentar guardar el usuario, intente más tarde."});
    }
};

export const update = (req, res) => {
    try {
        let { id } = req.params;

        let { firstname, lastname, email } = req.body;

        const user = User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        if(firstname) user.firstname = firstname;
        if(lastname) user.lastname = lastname;
        if(email) user.email = email; 

        user.update();

        res.status(201).json({message: "Usuario actualizado con éxito.",  user });

    } catch (error) {
        console.log(error);

        if(error.code){
            return res.status(error.code).json({message: error.message});
        }
        res.status(500).json({
            message: "Error al intentar actualizar el usuario.",
        });
    }
};


export const deleteById = (req, res) => {
    try {
        let { id } = req.params;
        const user = User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        user.delete();

        res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al intentar eliminar el usuario, intente más tarde.",
        });
    }
};