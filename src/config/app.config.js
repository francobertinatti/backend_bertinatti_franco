require('dotenv').config()

module.exports = {
    port: process.env.PORT || 8080,
    dev_env: process.env.DEV_ENV || 'development',
    private_key: process.env.PRIVATE_KEY || 'contraseña',
    mail_pass: process.env.MAIL_PASS,
}