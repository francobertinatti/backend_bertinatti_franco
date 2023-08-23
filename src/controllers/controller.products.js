const {Router} = require('express');
const router = Router();

const productManager = require('../dao/Products.dao');
const pm = new productManager('/products.json')
const uploader = require('../utils/multer.utils');
const generateProducts = require('../utils/mock.utils');
const privateAccess = require('../middlewares/privateAccess.middleware');
const adminAccess = require('../middlewares/adminAccess.middleware');
const CustomError = require('../handlers/errors/CustomError')
const EnumErrors = require('../handlers/errors/EnumError')
const generateProductErrorInfo = require('../handlers/errors/info');
const Products = require('../dao/models/Products.model');
const Users = require('../dao/models/Users.model');

//-------------------DB----------------------------------
router.get('/', privateAccess, async (req,res)=>{
  try {
      const {user} = req.session
      const limit = parseInt(req.query.limit)||10;
      const page = parseInt(req.query.page)||1;
      /* const query = req.query.query || ''; */
      const category = req.query.category || '';
      /* const query = req.query.query ? { $or: [{ name: { $regex: req.query.query, $options: 'i' } }, { category: { $regex: req.query.query, $options: 'i' } }] } : {}; */
      const sort = req.query.sort || '';

      const result = await pm.buscarConPaginacion(limit, page, category , sort);
      /* const result = await pm.buscarConPaginacion(query, {limit, page, sort}) */

      const data = {
        status: "success",
        payload: result.products, //Array de productos
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `http://${req.headers.host}/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&category=${category}` : null,
        nextLink: result.hasNextPage ? `http://${req.headers.host}/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&category=${category}` : null
      }

     res.render('products.handlebars', {
      user,
      products: data.payload,
      totalPages: data.totalPages,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      page: data.page,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: data.prevLink,
      nextLink: data.nextLink,
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
     })

  } catch (error) {
    res.json({status: "error", payload: error.message})
  }
})

router.get('/mockingproducts', (req,res)=>{
  try {
    const mockingProducts = generateProducts();
    res.json({message: mockingProducts})
  } catch (error) {
    res.json({error: error})
  }
})


router.post('/', adminAccess ,async (req,res)=>{
  try {
    if(req.session.user.role !== 'premium' && req.session.user.role !== 'administrador'){
      throw new Error('Forbiden')
    }

    if(req.body.owner === null){
      req.body.owner === 'admin'
    }

    req.body.owner = req.session.user.email

    
    const {title, description, code, price, stock, category, thumbnails} = req.body

    if (!title || !price) {
      CustomError.createError({
      name: "Product creation error",
      cause: generateProductErrorInfo({ title, price}),
      message: "Error trying to create a product",
      code: EnumErrors.INVALID_TYPES_ERROR
      });
      }
      
    const newProductInfo = {
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      //thumbnails: req.file.filename //Comentado para no usar multer y poder pasar productos por JSON y no form
      thumbnails
    }
    const newProduct = await pm.crearUno(newProductInfo)
    res.json({
      status: "success",
      message: "Producto Agregado con exito",
      payload: newProduct
    })
  } catch (error) {
    res.json({error:error})
  }
})


router.get('/:pid', async (req,res)=>{
  try {
    const {pid} = req.params;
    const product = await pm.buscarUno(pid)
    if(!product){
      res.status(404).json({error: 'Product not found'})
    }else{
      res.status(200).json(product)
    }
  } catch (error) {
    res.status(500).json({message: 'Internal server error'})
  }
}) //Corregir los codigos de estado, si falla devuelve 200

router.patch('/:pid', adminAccess, uploader.single('file'), async(req,res)=>{
  try{
    const {pid} = req.params;
    const data = req.body
    const product = await Products.findById(pid)

    if (req.session.user.role === 'administrador' || (req.session.user.email !== 'premium' && product.owner !== 'premium')) {
      return new Error('Unauthorized')
    }

    await pm.actualizarUno(pid, data);
    res.status(200).json('Producto actualizado')
  }catch(error)
  {
    res.json({message: error})
  }
})

router.delete('/:pid', adminAccess, async(req,res)=>{
  try {
    const {pid} = req.params;
    const product = await Products.findById(pid)

    if(req.session.user.role === 'admin' || (req.session.user.role !== 'premiun' && product.owner !== 'premium')){
      return new Error('Unauthorized')
    }
    await pm.eliminarUno(pid);
    res.status(200).json('Producto Eliminado')
  } catch (error) {
    res.json({message: error})
  }
})

//Cerrar sesion
router.post('/logout', async (req, res) => {
      const fechaActual = new Date()

      const dia = String(fechaActual.getDate()).padStart(2, '0');
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const anio = String(fechaActual.getFullYear()).slice(-2);
      const horas = String(fechaActual.getHours()).padStart(2, '0');
      const minutos = String(fechaActual.getMinutes()).padStart(2, '0');

      const fecha = `${dia}/${mes}/${anio} ${horas}:${minutos}`;
      
      await Users.findByIdAndUpdate(req.session.user._id, {last_connection: fecha}) 

    req.session.destroy((err) => {
      if (err) {
        logger.error('Error al cerrar sesion', err)
        /* console.error(err); */
      } else {
        res.redirect('/');
      }
    });
  });

//Metodo Privado
/* router.delete('/deleteAll', async (req,res)=>{
  await pm.eliminarTodos()
  res.json({message: 'DB vaciada'})
}) */

//METODO NO IMPLEMENTADO EN ESTA ENTREGA
/* router.get('/loadItems', async (req,res)=>{
  try {
    const products = await pm.getProducts() //Modificarlo para que sea con base de datos
    res.json({message: products })    
  } catch (error) {
    res.json(error)
  }
}) */

//--------------------FS--------------------------------
/* router.get('/', async (req, res) => {
    try {
      const limit = req.query.limit;
      const products = await pm.getProducts();
      const result = limit ? products.slice(0, limit) : products;
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
 */

/* router.get('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await pm.getProductById(pid);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }); */

/* router.post('/', (req,res)=>{
  try {
    const {title, description, code, price, stock, category, thumbnails} = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados' });
    }
    const products = pm.getProductsArchivo();
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    products.push(newProduct);
    pm.saveProductsArchivo(products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
}); */

/* router.patch('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedProduct = req.body;
    pm.updateProduct(pid, updatedProduct);
    res.status(200).json("Producto actualizado con exito");
  });

router.delete('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    pm.deleteProduct(pid);
    res.status(200).json("Producto eliminado con exito");
  }); */

module.exports = router

//Esto copiarlo en un controller-users mas adelante.
/* 
const {Router} = require('express');

const router = Router()

router.get('/session', (req,res)=>{
  if(req.session.counter){
    req.session.counter++
    return res.json({message: `Ingresaste ${req.session.counter} veces`})
  }

  req.session.counter = 1;
  req.session.role = "admin";
  req.session.status = true;
  res.json({message: 'Wellcome'})
})

module.exports = router */