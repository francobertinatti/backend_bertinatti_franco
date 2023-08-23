const Tickets = require('../models/Tickets.model')
const logger = require('../../utils/logger.utils')

class CartsRepository{
    async saveProduct(cart, product) {
        try {
          if (!product) throw new Error('Product not found');
    
          const itemIndex = cart.productos.findIndex(item => item.product._id.equals(product._id));
          if (itemIndex !== -1) {
            cart.productos[itemIndex].quantity += 1;
          } else {
            cart.productos.push({
              product: product,
              quantity: 1
            });
          }
          await cart.save();
          logger.debug('Producto guardado con exito')
        } catch (error) {
          logger.error('Error al agregar producto a carrito', error)
          throw error
        }
      }
    
      async processDataTicket(code, userEmail, cart) {
    
        const productsProcessed = []
        const productsNOProcessed = [];
        let total = 0;
      
        await Promise.all(
          cart.productos.map(async (item) => {
            const product = item.product;
            const requestedQuantity = item.quantity;
      
            if (requestedQuantity <= product.stock) {
              product.stock -= requestedQuantity;
              await product.save();
              total += product.price * requestedQuantity;
              productsProcessed.push(item)
            } else {
              productsNOProcessed.push(product._id);
            }
          })
        );
    
        cart.productos = productsProcessed
        await cart.save()
    
        const ticket = await Tickets.create({
          code,
          purchase_datatime: Date.now(),
          amount: total,
          purchaser: userEmail
        });
    
        return ticket, productsNOProcessed
    
      }
}

module.exports = CartsRepository