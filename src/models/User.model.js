import { v4 as uuidV4 } from "uuid";
import { readDataJson, writeDataJson } from "../utils/utils.js";

const filename = "users.json";

class User {
    constructor(firstname, lastname, email, id= uuidV4()){
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.id = id;
    }

    save(){
        const data = readDataJson(filename);

        const exist = data.users.some(u => u.email == this.email);

        if(exist){

            const error = new Error("Ya existe un usuario registrado con el email: " + this.email);
            error.code = 400;
            throw error;
        }

        data.users.push(this);
        writeDataJson(filename, data);

        return this;
    }

    update(){
        const data = readDataJson(filename);
        let indexUser = data.users.findIndex(u => u.id == this.id);

        if(indexUser == -1){
            const error = new Error("No puede actualizar un usuario que no existe en la base de datos, primero debe crearlo.");
            error.code = 400;
            throw error;
        }

        const userCompare = data.users.find(u => u.email == this.email);

        if(userCompare && userCompare.id != this.id ){
            const error = new Error("El correo que intenta actualizar, pertenece a otro usuario, pruebe con otro correo.");
            error.code = 400;
            throw error;
        }
        
        data.users[indexUser] = this;
        writeDataJson(filename, data);
        return this;
    }


    delete(){
        const data = readDataJson(filename);
        let indexUser = data.users.findIndex(u => u.id == this.id);

        if(indexUser == -1){
            const error = new Error("No puede eliminar un usuario que no existe en la base de datos, primero debe crearlo.");
            error.code = 400;
            throw error
        }
        
        data.users.splice(indexUser, 1);

        writeDataJson(filename, data);
        return true;
    }

    //static methods
    static findAll(){
        const { users } = readDataJson(filename);

        return users.map(user => {
            let {firstname, lastname, email, id} = user;
            return new User(firstname, lastname, email, id);
        })
    }

    static findById(idUser){
        const { users } = readDataJson(filename);
        const user = users.find(u => u.id == idUser);

        if(!user) return false;

        let {firstname, lastname, email, id} = user;

        return new User(firstname, lastname, email, id);
    }

    static findByEmail(emailUser){
        const { users } = readDataJson(filename);
        emailUser = emailUser.toLowerCase().trim();
        const user = users.find(u => u.email.toLowerCase() == emailUser);
        
        if(!user) return false;

        let {firstname, lastname, email, id} = user;

        return new User(firstname, lastname, email, id);
    }
}



export default User;