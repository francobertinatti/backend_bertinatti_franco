const Messages = require('./models/Messages.model')

class ChatsDao {
    constructor(){
    }

    async create(user, message){
        try {
            const newMessage = {user, message}
            const chat = await Messages.create(newMessage)
            /* console.log('Log en el dao: ' + chat); */ //Aca llega vacio
            return chat
        } catch (error) {
            return error
        }
    }

    async getChats(){
        try {
            return await Messages.find().lean()
        } catch (error) {
            return error
        }
    }
}

module.exports = ChatsDao