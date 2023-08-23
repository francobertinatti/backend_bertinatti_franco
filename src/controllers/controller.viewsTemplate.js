const {Router} = require('express')
const publicAccess = require('../middlewares/publicAccess.middleware')
const privateAccess = require('../middlewares/privateAccess.middleware')

const router = Router();

//Si la sesion ya estaba iniciada, esto permite no tener que loggearse de nuevo
router.get('/', privateAccess, (req,res)=>{
    res.redirect('/api/products')
})

router.get('/api/signup', publicAccess, (req,res)=>{
    res.render('signup.handlebars')
})

router.get('/api/login', publicAccess, (req,res)=>{
    res.render('login.handlebars')
})



module.exports = router