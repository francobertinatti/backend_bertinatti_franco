const jwt = require('jsonwebtoken')
const {private_key}= require('../config/app.config')

const generateToken = (email) => {
    const token = jwt.sign({ email }, private_key, { expiresIn: "1h" });
    return token;
  };

const verifyToken = (token)=>{
  const verifiedToken = jwt.verify(token, private_key) 
  return verifiedToken
}

module.exports = {
  generateToken,
  verifyToken
}