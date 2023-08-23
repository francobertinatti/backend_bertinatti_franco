/* const {Router} = require('express');
const productManager = require('../dao/ProductManager');
const router = Router();
const pm = new productManager('/products.json');

const products = pm.buscarTodos()

router.get('/', async(req,res)=>{
    console.log(products)
    await res.render('home.handlebars', {products, title:"Titulo Dinamico de prueba en index"})
})

module.exports = router */

//CODIGO NO IMPLEMENTAADO EN ESTA ENTREGA