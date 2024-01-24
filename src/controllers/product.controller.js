// controllers/product.controller.js
import productService from "../services/product.service.js";
import Exception from "../utils.js";

export default class productController {
  static async get(query = {}) {
    try {
      const { limit = 10, page = 1, sortField = "price", sortOrder, ...criteria } = query;
      const filter = { ...criteria };
      const options = { page: parseInt(page, 10), limit: parseInt(limit, 10) };

      if (sortField) {
        options.sort = { [sortField]: sortOrder };
      }

      const products = await productService.getProducts({ filter, options });
      const response = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null,
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
      return await productService.getProductById(pid);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async createProduct(product) {
    try {
      const createdProduct = await productService.createProduct(product);
      console.log("Producto creado");
      return createdProduct;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateById(pid, data) {
    try {
      return await productService.updateProductById(pid, data);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteById(pid) {
    try {
      return await productService.deleteProductById(pid);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
