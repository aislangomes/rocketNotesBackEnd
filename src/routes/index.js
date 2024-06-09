const {Router} = require("express")

const userRoutes= require('./user.routes.js')
const notesRoutes= require('./notes.routes.js')
const tagsRoutes= require('./tags.routes.js')


const router = Router()
router.use('/users', userRoutes)
router.use('/notes', notesRoutes)
router.use('/tags', tagsRoutes)


module.exports = router;