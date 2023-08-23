const Tickets = require('../models/Tickets.model')
const Products = require('../models/Products.model')
const logger = require('../../utils/logger.utils')

class TicketsRepositoy {
    proccessDataTicket = async (code, userEmail, cart)=>{
        const productsProcessed = []
        const productsNOProcessed = []
        let total = 0

        for(let i = 0; i < cart.productos.length; i++){
            const item = cart.productos[i];

            //Si el producto seleccionado tiene Stock lo procesa y lo retorna
            const product = await this.processItem(item, productsProcessed, productsNOProcessed)
            if(product){
                const productQuantity = item.quantity;
                const subTotal = product.price * productQuantity;
                total += subTotal;
            }
        }

        cart.productos = cart.productos.filter((item)=> !productsProcessed.some((itemProcessed) => itemProcessed._id.toString() === item.product._id.toString()));
        await cart.save();

        const ticket = await Tickets.create({
            code,
            purchase_datetime: Date.now(),
            amount: total,
            purchaser: userEmail,
            productsProcessed: productsProcessed
        })

        return {
            ticket,
            productsNOProcessed,
        }
    }

    //Controla si existe stock para procesarlo o no (De a uno en uno)
    processItem = async (item, productsProcessed, productsNOProcessed)=>{
        const productId = item.product._id;
        const productQuantity = item.quantity;

        try {
            const product = await Products.findById(productId);
            if(productQuantity <= product.stock){
                product.stock -= productQuantity;
                await product.save();
                productsProcessed.push(product);
                return product
            } else{
                productsNOProcessed.push(product)
            }
        } catch (error) {
            logger.error('Error al procesar producto', error)
            /* console.log(error) */
        }
    }
}

module.exports = TicketsRepositoy