const viewsTemplateController = require('../controllers/controller.viewsTemplate')
const authController = require('../controllers/controller.auth')
const usersController = require('../controllers/controller.users')
const productsRouter = require('../controllers/controller.products')
const cartRouter = require('../controllers/controller.cart')
const messagesRouter = require('../controllers/controller.messages')
const sessionsController = require('../controllers/controller.sessions')
const loggerTest = require('../controllers/controller.loggerTest')
const privateAccess = require('../middlewares/privateAccess.middleware')
const adminController = require('../controllers/controller.admin')

const router = app =>{
    //Esta maneja las 2 siguientes
    app.use('/', viewsTemplateController)
  
    app.use('/api/auth', authController) //Login
    app.use('/api/users', usersController); //Registro

    app.use('/api/products', productsRouter); 
    app.use('/api/carts', cartRouter);
    app.use('/api/messages', privateAccess, messagesRouter)
    app.use('/api/sessions', sessionsController)
    app.use('/api/loggerTest', loggerTest)
    app.use('/api/admin', adminController)
    /* app.use('/', todosLosProductos); */
    /* app.use('/realtimeproducts', realTimeProducts) */
}

module.exports = router