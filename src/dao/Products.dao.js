const fs = require("fs");
const Products = require("./models/Products.model");

class ProductDAO {
  constructor(path) {
    this.path = path;
  }
  //---------------------DB------------------------------------------------
  async buscarTodos() {
    try {
      return await Products.find();
    } catch (error) {
      return error;
    }
  }

/* async buscarConPaginacion(query, {limit, page, sort})  */ 
  async buscarConPaginacion(limit, page, query, sort) 
  {
    try {
      const options = {
        page: page,
        limit: limit,
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : null,
        customLabels: {
          totalDocs: 'totalItems',
          docs: 'products',
          page: 'page',
          nextPage: 'nextPage',
          prevPage: 'prevPage',
          totalPages: 'totalPages',
          hasNextPage: 'hasNextPage',
          hasPrevPage: 'hasPrevPage',
          nextPageLink: 'nextLink',
          prevPageLink: 'prevLink'
        },
      };

      let queryObject;

      if(query){
        queryObject = 
        { 
          category: {
            $regex: query,
            $options: 'i'
          }
        }
      }else{
        queryObject= {}
      }
      
      const result = await Products.paginate(queryObject, options);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async buscarUno(id) {
    try {
      return await Products.findById(id);
    } catch (error) {
      return "No se pudo encontrar";
    }
  }

  async crearUno(newProductInfo) {
    try {
      return await Products.create(newProductInfo);
    } catch (error) {
      return error;
    }
  }

  async crearMuchos(newProductsInfo) {
    try {
      return await Products.insertMany(newProductsInfo);
    } catch (error) {
      return error;
    }
  }

  async actualizarUno(id, data) {
    try {
      return await Products.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      return error;
    }
  }

  async eliminarUno(id) {
    try {
      return await Products.findByIdAndUpdate(
        id,
        { status: false },
        { new: true }
      );
    } catch (error) {
      return error;
    }
  }

  //Metodo Privado
  /* async eliminarTodos(){
    await Products.deleteMany()
  } */

  //------------------------FS-------------------------------------------------
  /* addProduct(product) {
    const products = this.getProductsArchivo();
    const lastProductId =
      products.length > 0 ? products[products.length - 1].id : 0;
    product.id = lastProductId + 1;
    products.push(product);
    this.saveProductsArchivo(products);
  }

  getProducts() {
    return this.getProductsArchivo();
  }

  getProductById(id) {
    const products = this.getProductsArchivo();
    const product = products.find((p) => p.id == id);

    return product || null;
  }

  updateProduct(id, updatedProduct) {
    const products = this.getProductsArchivo();

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex !== -1) {
      products[productIndex] = Object.assign(
        {},
        products[productIndex],
        updatedProduct,
        { id }
      );
      this.saveProductsArchivo(products);
    }
  }

  deleteProduct(id) {
    const products = this.getProductsArchivo();
    const filteredProducts = products.filter((p) => p.id !== id);

    this.saveProductsArchivo(filteredProducts);
  }

  //Si voy a trabajar con DB usar async y modificar todo
  getProductsArchivo() {
    try {
      if (!fs.existsSync(process.cwd() + "/src/files" + this.path)) {
        fs.writeFileSync(process.cwd() + "/src/files" + this.path, "[]");
      }
      const productsData = fs.readFileSync(
        process.cwd() + "/src/files" + this.path,
        "utf-8"
      );
      const products = JSON.parse(productsData);
      return products;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  saveProductsArchivo(products) {
    fs.writeFileSync(
      process.cwd() + "/src/files" + this.path,
      JSON.stringify(products)
    );
  } */
}

module.exports = ProductDAO;

//COMPLETAR ESTE DAO