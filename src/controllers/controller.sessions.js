const {Router} = require('express')
const router = Router()
const UserDTO = require('../dao/dto/users.dto')

router.get('/current', (req, res) => {
  const session = new UserDTO(req.session.user)
  return res.status(200).json(session)
})

module.exports = router