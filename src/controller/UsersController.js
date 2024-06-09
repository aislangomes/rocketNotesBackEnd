const { hash, compare } = require("bcryptjs")
const AppErrors = require("../utils/AppErrors")
const sqliteConnection = require("../database/sqlite")


class UsersController {
    async create(req, res) {
        const {name, email, password} = req.body
        const database = await sqliteConnection()

        const checkIfUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkIfUserExist){
            throw new AppErrors("Email já em uso")
        }
        const hashedPassword = hash(password, 8);

        await database.run("INSERT INTO users (name, email, password) VALUES( ?, ?, ?)", [name,email, hashedPassword])
        return res.status(201).json()


    }

    async update(req, res) {
        const {name, email, password, old_password} = req.body;
        const { id } = req.params;
        const database = await sqliteConnection()

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        if (!user){
            throw new AppErrors("Usuario nao encontrado")

        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppErrors("Este email ja esta em uso")
        }

        user.name = name ?? user.name ;
        user.email = email ?? user.email;

        if(password && !old_password){
            throw new AppErrors("Você precisa informar a senha antiga")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword){
                throw new AppErrors("A senha antiga não confere.")
            }

            user.password = await hash(password, 8);
        }

        console.log("tudo certo")
        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, id]
        );
        console.log("atualizou")

        return res.status(200).json({message: "Usuario atualizado."})

    }



}

module.exports = UsersController;