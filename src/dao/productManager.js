import productModel from "../models/product.model.js";
import Exception from "../utils.js";

export default class productManager {
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

      const products = await productModel.paginate(filter, options);

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
    const product = await productModel.findById(pid);
    if (!product) {
      throw new Exception("No existe el producto", 404);
    }
    return product;
  }
  static async createProduct(product) {
    const Product = await productModel.create(product);
    console.log("Producto creado");
    return Product;
  }
  static async updateById(pid, data) {
    const product = await productModel.findById(pid);
    if (!product) throw new Exception("El producto no existe", 404);
    const criterio = { _id: pid };
    const operation = { $set: data };
    await productModel.updateOne(criterio, operation);
    console.log('Producto actualizado');
    return {message: 'Producto actualizado'};
  }
  static async deleteById(pid) {
    const product = await productModel.findById(pid);
    if (!product) throw new Exception("El producto no existe", 404);
    const criterio = { _id: pid };
    await productModel.deleteOne(criterio);
    console.log("Producto aliminado");
    return {message: 'Producto eliminado'};
  }
}
