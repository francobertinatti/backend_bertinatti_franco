const { Router } = require("express");
const adminAccess = require("../middlewares/adminAccess.middleware");
const Users = require("../dao/models/Users.model");
const logger = require("../utils/logger.utils");

const router = Router()

router.get('/',adminAccess, async (req, res) => {
  try {
    const users = await Users.find()
    res.render('users.handlebars', {users})
  } catch (error) {
    logger.error(error)
  }
})


module.exports = router