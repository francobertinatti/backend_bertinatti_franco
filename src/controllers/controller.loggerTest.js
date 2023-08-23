const {Router} = require('express')
const router = Router()
const logger = require('../utils/logger.utils')

router.get('/', (req, res) => {
  logger.debug('Nivel Debug')
  logger.info('Nivel Info')
  logger.warning('Nivel Warning')
  logger.error('Nivel Error')

  res.json('Prueba de logs exitosa')
})

module.exports = router