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

        await database.run("INSERT INTO users (name, email, password) VALUES( ?, ?, ?)", [name,email,password])
        return res.status(201).json()


    }



}

module.exports = UsersController;