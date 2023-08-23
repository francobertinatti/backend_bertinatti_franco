const {Router} = require('express');
const ChatsDao = require('../dao/Messages.dao');
const userAccess = require('../middlewares/userAccess.middleware');

const router = Router();
const Chats = new ChatsDao()

router.get('/', userAccess,async(req,res)=>{
    try {
        const chats = await Chats.getChats()
        res.render('chat.handlebars', {chats, title:"Chat"} )
    } catch (error) {
        res.status(400).json({error: error})
    }
})

router.post('/', userAccess,async (req, res, next) => {
    try {
        const { user, message } = req.body
        const msj = await Chats.create(user, message)
        res.json({ messages: msj })
    } catch (error) {
        logger.error('Error al enviar mensaje', error)
       /*  console.log(error); */
        next(error)
        /* res.status(400).json({ error: error }) */
    }
})

module.exports = router