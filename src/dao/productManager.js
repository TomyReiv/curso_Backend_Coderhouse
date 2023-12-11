import productModel from "../models/product.model.js";
import Exception from "../utils.js";

export default class productManager {
  
  static async get(filter, options) {
    try {
      const response = await productModel.paginate(filter, options);
      return response;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getById(pid) {
    try {
      const product = await productModel.findById(pid);
      return product;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async createProduct(product) {
    try {
      const Product = await productModel.create(product);
      console.log("Producto creado");
      return Product;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateOne(pid, data) {
    try {
      const response = await productModel.updateOne({pid}, {data});
      console.log("Producto actualizado");
      return { message: "Producto actualizado" };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteById(pid) {
    try {
      const response = await productModel.deleteOne({_id:pid});
      console.log("Producto aliminado");
      return { message: "Producto eliminado" };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}