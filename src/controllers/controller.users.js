const {Router} = require('express');
const passport = require('passport');
const path = require('path')

const logger = require('../utils/logger.utils')
const UserRepository = require('../dao/repository/users.repository')
const uploader = require('../utils/multer.utils')
const Users = require('../dao/models/Users.model')
const UserDTO = require('../dao/dto/users.dto')
const adminAccess = require('../middlewares/adminAccess.middleware')


const router = Router()

router.post('/', passport.authenticate('register',{failureRedirect: '/users/failregister'}), 
async(req,res)=>{
    try {
        logger.info('Usuario registrado con exito')
        res.status(201).json({status: 'success', message: 'Usuario Registrado'})
    } catch (error) {
        logger.error('Error al crear usuario', error)
        /* console.log(error); */
        res.status(500).json({status: 'error', error: 'Internal server error'})
    }    
})

router.get('/premium/:uid', async (req, res) => {
    try {  
      
      const {uid} = req.params

      const user = await Users.findById(uid)


      if(user.role === 'administrador'){
        throw new Error('Unauthorized')
      }

      const reqDocuments = ['product','profile','document'];
      const userDocuments = user.documents.map((item)=>{path.basename(item.name, path.extname(item.name))})

      const cumpleRequisitoDocumentos = reqDocuments.every((item)=>{userDocuments.incluides(item)})

      if(!cumpleRequisitoDocumentos){
        throw new Error('Error de documentos')
      }

      const userRepository = new UserRepository()
      const changeRole = await userRepository.changeRole(user)
      logger.info('se cambio el role del usuario actual', changeRole)
      res.json({user: changeRole})
      
    } catch (error) {
      logger.error('Error al cambiar el rol', error)
    }
})

router.post('/:uid/documents', uploader.any(), async (req,res)=>{
  try {
    const {uid} = req.params
    const user = await Users.findById(uid)
    const upDocuments = req.files.map((file) => ({
      name: file.originalname,
      reference: file.filename,
    }))
    user.documents.push(...upDocuments)
    await user.save()
    res.json({message: 'Documentso actualizados'})
  } catch (error) {
    res.status(500).json({error: error})
  }
})

router.get('/', async(req,res)=>{
  try {
    const users = await Users.find()
    const userDTOs = users.map(user => new UserDTO(user))

    res.status(200).json({message: userDTOs})

  } catch (error) {
    logger.error('Error al traer los usuarios', error)
  }
})


router.delete('/', async (req, res) => {
  try {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - (5 * 60 * 1000) /* (2 * 24 * 60 * 60 * 1000) */);
  
    const inactiveUsers = await Users.find({
      last_connection: {
        $lt: twoDaysAgo
      }
    });
    console.log(twoDaysAgo)

    console.log(inactiveUsers)

  /*   await Users.deleteMany({
      last_connection: {
        $lt: twoDaysAgo
      }
    }) */
  
  /*   for (const user of inactiveUsers) {
      await user.deleteOne();
    } */
  
    res.status(200).json({message: `Esta ruta no hace nada...Usuarios eliminados: ${inactiveUsers.length}`});
  } catch (error) {
    logger.error(error)
  }
});

router.get('/deleteUser/:uid',adminAccess, async (req, res, next) => {
  try {
    const userId = req.params.uid
    const user = await Users.findOne({_id: userId})
    await Users.deleteOne({_id: userId})

    res.status(201).json({message: `Usuario ${user.email} eliminado`})
  } catch (error) {
    logger.error(error)
  }

})


router.get('/changeRole/:uid',adminAccess,  async (req, res, next) => {
  try {
    const userId = req.params.uid
    const user = await Users.findById(userId)

    if(user.role === 'admin'){
      logger.error('El usuario al que intentas cambiar el rol ya es admin')
      return
    }

    const userRepository = new UserRepository()
    const userChanged = await userRepository.changeRole(user)
    res.status(200).json({message: `rol de ${userChanged.first_name} cambiado con exito`})
  } catch (error) {
    logger.error(error)
  }
})


router.get('/failregister', (req,res)=>{
    logger.error('Falló estrategia de registro');
   /*  console.log('Falló estrategia de registro'); */
    res.json({error: 'Failed register'})
})


router.get('/redirect', (req,res)=>{
    res.redirect('/api/signup')
})



module.exports = router;