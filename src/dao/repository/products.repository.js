const Products = require("../models/Products.model");

class ProductsRepository {
  async buscarConPaginacion(limit, page, query, sort) {
    try {
      const options = {
        page: page,
        limit: limit,
        sort:
          sort === "asc"
            ? { price: 1 }
            : sort === "desc"
            ? { price: -1 }
            : null,
        customLabels: {
          totalDocs: "totalItems",
          docs: "products",
          page: "page",
          nextPage: "nextPage",
          prevPage: "prevPage",
          totalPages: "totalPages",
          hasNextPage: "hasNextPage",
          hasPrevPage: "hasPrevPage",
          nextPageLink: "nextLink",
          prevPageLink: "prevLink",
        },
      };

      let queryObject;

      if (query) {
        queryObject = {
          category: {
            $regex: query,
            $options: "i",
          },
        };
      } else {
        queryObject = {};
      }

      const result = await Products.paginate(queryObject, options);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  
}



module.exports = ProductsRepository;
