const { Router } = require("express")
const UsersController = require("../controller/UsersController")
const createUser = Router()


const usersController = new UsersController()

createUser.post("/", usersController.create)

module.exports = createUser;