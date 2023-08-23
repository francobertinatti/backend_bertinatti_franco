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

  
}

module.exports = ProductDAO;
