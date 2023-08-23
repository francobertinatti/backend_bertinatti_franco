const mongoose = require('mongoose')
const {dbAdmin, dbPassword, dbHost, dbName} = require('../src/config/db.config');
const logger = require('../src/utils/logger.utils');

const mongoConnect = async()=>{
    try {
        await mongoose.connect(`mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`)
        logger.info('Base de datos conectada')
        /* console.log('db is connected'); */
    } catch (error) {
        logger.fatal('Error al conectar base de datos', error)
        /* console.log(error); */
    }
}

module.exports = mongoConnect

