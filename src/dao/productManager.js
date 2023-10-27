import productModel from "../models/product.model.js";
import Exception from "../dirname.js";

export default class productManager {
  static async get(query = {}) {
    const criterion = {};
    if (query._id) criterion._id = query._id;
    if (query.title) criterion.title = query.title;
    if (query.description) criterion.description = query.description;
    if (query.price) criterion.price = query.price;
    if (query.code) criterion.code = query.code;
    if (query.category) criterion.category = query.category;
    if (query.stock) criterion.stock = query.stock;
    const products = await productModel.find(criterion);
    return products;
  }

  static async getById(uid) {
    const product = await productModel.findById(uid);
    if(!product) {throw new Exception ('No existe el producto', 404)}
    return product;
  }
  static async createProduct(product) {
    const Product = await productModel.create(product);
    console.log('Producto creado');
    return Product;
  }
  static async updateById(uid, data) {
    const product = await productModel.findById(uid);
    if (!product) throw new Exception("El producto no existe", 404);
    const criterio = {_id: uid};
    const operation = {$set: data}
    await productModel.updateOne(criterio, operation);
    console.log('Usuario actualizado');
  }
  static async deleteById(uid) {
    const product = await productModel.findById(uid);
    if (!product) throw new Exception("El producto no existe", 404);
    const criterio = {_id: uid};
    await productModel.deleteOne(criterio);
    console.log('Usuario eliminado');
  }
}
