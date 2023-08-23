const Carts = require("./models/Carts.model");

class CartsDAO {
  constructor(path, pm) {
    this.path = path;
    this.productManager = pm;
  }

  //------------------DB---------------------------------------------
  async getCartDBbyId(id) {
    try {
      return await Carts.findById(id).populate("productos.product");
    } catch (error) {
      return error;
    }
  }

  async createCartDB(data) {
    try {
      return await Carts.create(data);
    } catch (error) {
      return error;
    }
  }

  async addProductDB(cartId, prodInfo, quantity) {
    try {
      const cart = await Carts.findById(cartId);
      const newProduct = {
        ...prodInfo,
        quantity,
      };
      if (cart.productos.some((i) => i.id === prodInfo.id)) {
        await Carts.updateOne(
          { _id: cartId, "products.id": prodInfo.id },
          { $inc: { "products.$.quantity": quantity } }
        );
      } else {
        await Carts.updateOne({ $push: { productos: newProduct } });
        return true;
      }

      //const newProd = cart.products.push(newProdInfo)
    } catch (error) {
      return error;
    }
  }

  async updateCartDB(cartId, products) {
    try {
      const cart = await Carts.findById(cartId);
      const newProducts = [];
  
      /* console.log(products) */
      products.forEach(product => {
        const index = cart.productos.findIndex(p => p.product === product._id);
  
        if (index !== -1) {
          cart.productos[index].quantity += product.quantity;
        } else {
          cart.productos.push(product);
        }
  
        newProducts.push(cart.productos[index]);
      });

      await cart.save();
  
      return newProducts;
    } catch (error) {
      throw error;
    }
  }

  async updateCartItem(cartId, productId, quantity) {
    try {
      const cart = await Carts.findById(cartId);
      const item = cart.productos.find(p => p.product == productId);
      if (!item) throw new Error("Producto no está en carrito");
      //Hacer control de stock con modelo de productos
      item.quantity = quantity;
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Carts.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');
      const productIndex = cart.productos.findIndex(p => p.product.equals(productId));
      if (productIndex === -1) throw new Error('Product not found in cart');
      cart.productos.splice(productIndex, 1);
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
  async updateProductDB(cartId, productId, quantity) {
    try {
      const cart = await Carts.findOneAndUpdate(
        { _id: cartId, "products.product": productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      ).populate("products.product");

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async removeAllProductsFromCartDB(cartId) {
    try {
      const cart = await Carts.findByIdAndUpdate(
        cartId,
        { productos: [] },
        { new: true }
      );

      return cart;
    } catch (error) {
      throw error;
    }
  }

  //------------------FS---------------------------------------------
  /* addProductToCart(cartId, productId, quantity) {
    const carts = this.getCartsArchivo();
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const product = this.productManager.getProductById(productId);

      if (product) {
        const existingProductIndex = cart.products.findIndex(
          (p) => p.id === productId
        );
        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += quantity;
        } else {
          cart.products.push({ id: productId, quantity });
        }
        this.saveCartsArchivo(carts);
      }
    }
  }

  getCarts() {
    return this.getCartsArchivo();
  }

  getCartsById(id) {
    const carts = this.getCartsArchivo();
    const cart = carts.find((c) => c.id == id);

    return cart || null;
  }

  getCartsArchivo() {
    try {
      if (!fs.existsSync(this.path)) {
        fs.writeFileSync(this.path, "[]");
      }
      const cartsData = fs.readFileSync(this.path, "utf-8");
      const carts = JSON.parse(cartsData);
      return carts;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  saveCartsArchivo(carts) {
    fs.writeFileSync(this.path, JSON.stringify(carts));
  } */
}
module.exports = CartsDAO;


/* const CartsRepository = require("./repository/carts.repository");

async function saveProductInCart(cart, product){
  try {
    const cartsRepository = new CartsRepository()
    return cartsRepository.saveProduct(cart, product)
  } catch (error) {
    return error
  }
}

module.exports = saveProductInCart */

