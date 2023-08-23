const port = require('../../config/app.config')
const {generateToken, verifyToken} = require('../../utils/jwt.utils')
const passwordValidate = require('../../utils/cryptPassword.utils')
const createHash = require('../../utils/cryptPassword.utils')
const logger = require('../../utils/logger.utils')
const transport = require('../../utils/mail.util')
const Users = require('../models/Users.model')


class ResetPasswordRepository{
    async sendEmail(email){
        try {
            const resetLink = `http://localhost:${port}/api/auth/forgetPassword/${email}`;

            const mailOptions = {
                from: 'rodrigobozio96@gmail.com',
                to: email,
                subject: 'Restablecer contraseña',
                text: `Para restablecer constraseña haga click aqui: ${resetLink}` 
            }
            transport.sendMail(mailOptions, (error, info)=>{
                if(error){  
                    console.log(error)
                    //logger.error('Error al enviar correo', error)
                }else{
                    logger.info('Correo enviado', info.response )
                }
            })
        } catch (error) {
            throw error
        }
    }
    
    async createToken(email, res){
        try {
            const token = generateToken(email)
            await this.sendEmail(email)
            res.cookie('tokenPassword', token, {maxAge: 3600000, httpOnly: true})
            logger.info('Token generado con éxito')

        } catch (error) {
           throw error 
        }
    }

    async resetPassword(newPassword, token, email){
        try {
            const verifiedToken = verifyToken(token)
            if(verifiedToken.email !== email){
                return new Error('Error de verificación')
            }
            const user = await Users.findOne({email:email})
            const coincide = await passwordValidate(newPassword, user)
            if(coincide){
                alert('La contraseña debe ser diferente de la anterior')
                return res.status(401).json({error: 'La contraseña debe ser diferente de la anterior'})
            }
            const passwordHashed = await createHash(newPassword)

            user.password = passwordHashed
            await user.save()
            logger.info('Contraseña generada con exito')
        } catch (error) {
            throw error
        }
    }

}

module.exports = ResetPasswordRepository