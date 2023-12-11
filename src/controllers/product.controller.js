import productManager from "../dao/productManager.js";
import Exception from "../utils.js";

export default class productController {
  static async get(query = {}) {
    try {
      const {
        limit = 10,
        page = 1,
        sortField = "price",
        sortOrder,
        ...criteria
      } = query;

      const filter = {};

      if (criteria._id) filter._id = criteria._id;
      if (criteria.title) filter.title = criteria.title;
      if (criteria.description) filter.description = criteria.description;
      if (criteria.price) filter.price = criteria.price;
      if (criteria.code) filter.code = criteria.code;
      if (criteria.category) filter.category = criteria.category;
      if (criteria.stock) filter.stock = criteria.stock;

      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };

      if (sortField) {
        options.sort = { [sortField]: sortOrder };
      }

      const products = await productManager.get(filter, options);

      const response = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `/products?page=${products.prevPage}`
          : null,
        nextLink: products.hasNextPage
          ? `/products?page=${products.nextPage}`
          : null,
      };

      return response;
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  static async getById(pid) {
    try {
      const product = await productManager.getById(pid);
      if (!product) {
        throw new Exception("No existe el producto", 404);
      }
      return product;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async createProduct(product) {
    try {
      const Product = await productManager.createProduct(product);
      console.log("Producto creado");
      return Product;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async updateById(pid, data) {
    try {
      const product = await productManager.getById(pid);
      if (!product) throw new Exception("El producto no existe", 404);
      const criterio = { _id: pid };
      const operation = { $set: data };
      const response = await productManager.updateOne(criterio, operation);
      return { message: response.message };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async deleteById(pid) {
    try {
      const product = await productManager.getById(pid);
      if (!product) throw new Exception("El producto no existe", 404);
      const criterio = { _id: pid };
      const response = await productManager.deleteById(pid);
      return { message: response.message };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
