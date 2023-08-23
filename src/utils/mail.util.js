const nodemailer = require('nodemailer')
const mail_pass = require('../config/app.config')

const transport = nodemailer.createTransport({
    /* host: 'smtp.gmail.com', */
    service: 'gmail',
   /*  service: 'c1870509.ferozo.com', */
    port: 587,
    /* port: 465,   */
    /* secure: false, */
    /* rejectUnauthorized: false, */ //ESTO ME PUEDE SALVAR
    auth:{
       /*  user:'rodri@desusweb.com',
        password: 's7*o@Xw6dO', */
        user:'rodrigobozio96@gmail.com',
        pass: mail_pass,
    },
   /*  tls:{
        rejectUnauthorized: false
    } */
})

module.exports = transport