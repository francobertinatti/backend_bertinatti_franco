const { Router } = require("express");
const passport = require("passport");
const logger = require("../utils/logger.utils");
const ResetPasswordRepository = require('../dao/repository/resetPassword.repository')
const Users = require('../dao/models/Users.model')

const router = Router();

router.post(
  "/",
  passport.authenticate("login", { failureRedirect: "/auth/faillogin" }),
  async (req, res) => {
    try {
      if (!req.user)
        return res
          .status(401)
          .json({
            status: "error",
            error: "Usuario y contraseña no coinciden",
          });

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cartId: req.user.cartId
      };  

      const fechaActual = new Date()

       
       const dia = String(fechaActual.getDate()).padStart(2, '0');
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const anio = String(fechaActual.getFullYear()).slice(-2); // Solo los últimos dos dígitos del año
      const horas = String(fechaActual.getHours()).padStart(2, '0');
      const minutos = String(fechaActual.getMinutes()).padStart(2, '0');

      // Formatear la fecha y hora en el formato deseado
      const fecha = `${anio}/${mes}/${dia} ${horas}:${minutos}`; 
      await Users.findByIdAndUpdate(req.user._id, {last_connection: fecha})

      logger.info('Sesion iniciada con éxito')
      res.json({ status: "success", message: "Sesion iniciada" });

      

      /*      CON HASHEO - SIN PASSPORT
        const {email,password} = req.body;
        const user = Users.findOne({email});
        if(!user) return res.status(400).json({error: 'Datos erroneos'})

        const isPasswordValid = passwordValidate(password, user);
        if(!isPasswordValid) return res.status(401).json({error:'Datos erroneos'})

        res.json({message: 'success login'}) */

      /*      SIN HASHEO - Entrega del login simple   
        const {email, password} = req.body

        if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
            req.session.user = {
                first_name: 'Coder',
                last_name: 'House',
                age: 9,
                email: email,
                role: "admin"
            }
            res.json({status: 'success', message: 'Sesion iniciada'})
        }else{
            const user = await Users.findOne({email})
            if(!user){
                return res.status(400).json({status: 'error', error: 'Datos erroneos'})
            }        
    
            if(user.password !== password){
                return res.status(400).json({status: 'error', error: 'Datos erroneos'})
            }
    
            
            req.session.user = {
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                email: user.email,
                role: user.role
            }
           
            res.json({status: 'success', message: 'Sesion iniciada'})
        }  */
    } catch (error) {
      logger.error('Error al iniciar sesion', error)
      res.status(500).json({ status: "error", error: "Internal error server" });
    }
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

router.get("/faillogin", (req, res) => {
  logger.error("Falló estrategia de login")
  /* console.log("Falló estrategia de login"); */
  res.json({ error: "Failed login" });
});

router.get("/redirect", (req, res) => {
  res.redirect("/api/login");
});


//Parte de Recuperación de contraseña
router.get('/forgetPassword' , (req,res)=>{
  try {
    res.render('forgetPassword.handlebars')
  } catch (error) {
    logger.error('Error', error)
  }
})

router.get('/forgetPassword/:email', (req, res) => {
  try {
    const {email}= req.params

    res.render('resetPassword.handlebars', {email})
  } catch (error) {
    logger.error('Error', error)
  }
})

router.post('/forgetPassword',async (req, res) => {
  try {
    const {email} = req.body

    const session = await Users.findOne({email: email})

    if (!session){
      throw new Error('Usuario no encontrado, verifica tu correo electronico')
    }

    const resetPasswordRepository = new ResetPasswordRepository()
    const createToken = await resetPasswordRepository.createToken(email, res)

    res.json({message: 'token sent successfully',
              token: createToken})
  } catch (error) {
    logger.error('Error', error)
  }
})

router.post('/resetPassword/:email', async (req, res) => {
  const {newPassword} = req.body
  const {tokenPassword} = req.cookies
  const {email} = req.params
  
  try {
    const resetPasswordRepository = new ResetPasswordRepository()
    await resetPasswordRepository.resetPassword(newPassword, tokenPassword, email)

    res.status(200).json({message: 'Contraseña cambiada con exito'})
  } catch (error) {
    logger.error('Error', error)
  }
})

module.exports = router;
