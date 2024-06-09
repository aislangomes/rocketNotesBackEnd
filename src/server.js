require("express-async-errors")
const migrationsRun = require("./database/sqlite/migrations")
const AppErrors = require("./utils/AppErrors")
const express = require("express")
const routes = require('./routes')

migrationsRun()

const app = express()

app.use(express.json())
app.use(routes)
app.use((error, req, res, next) => {
    if(error instanceof AppErrors){
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    console.error(error)

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
})



const PORT = 3333
app.listen(PORT, () => console.log(`Servidor ligou na porta ${PORT}`)); 