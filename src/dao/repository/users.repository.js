const Users = require('../models/Users.model')
const Carts = require('../models/Carts.model')

class UsersRepository {

    createUser = async(userInfo)=>{
        try {
            const {first_name, last_name, email, age, password, role} = userInfo

            const cart = new Carts()
            await cart.save()
            const cartId = cart._id

            const newUserInfo = {
                first_name,
                last_name,
                email,
                age,
                password,
                role,
                cartId
            }

            const user = await Users.create(newUserInfo)
            return user

        } catch (error) {
            throw error
        }
    }

    changeRole = async(user)=>{
        try {
            const usuario = await Users.findOne({_id: user._id})

            if(usuario.role === 'user'){
                usuario.role = 'premium'
            }else{
                usuario.role = 'user'
            }

            await usuario.updateOne({role: usuario.role})

            return usuario
        } catch (error) {
            throw error
        }
    }
}

module.exports = UsersRepository