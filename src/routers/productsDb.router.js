import { Router } from "express";
import EnumsError from "../utils/EnumsError.js";
import { CustomError } from "../utils/CustomError.js";
import { generatorProductError } from "../utils/CauseMessageError.js";
import productController from "../controllers/product.controller.js";
import { uploader } from "../utils.js";
import {deleteProductCart} from "../middleware/daleteCascade.js"

const router = Router();

router.get("/products", async (req, res, next) => {
  try {
    const { query = {} } = req;
    const product = await productController.get(query);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
   /*  next(error); */
  }
});

router.get("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productController.getById({ _id: pid });
    if (!product) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
   /*  next(error); */
  }
});

router.post(
  "/products",
  uploader.single("file"),
  async (req, res, next) => {
    try {
      const { title, description, price, code, status, stock, category } =
        req.body;
      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !status ||
        !stock ||
        !category
      ) {
        CustomError.createError({
          name: "Eror creando el producto",
          cause: generatorProductError({
            title,
            description,
            price,
            code,
            status,
            stock,
            category,
          }),
          message: "Ocurrio un error mientras intemtamos crear el producto",
          code: EnumsError.BAD_REQUEST_ERROR,
        });
      }
      
      if (req.file) {
        body.thumbnail = {
          filename: file.filename,
          path: file.path,
        };
      }
      const result = await productController.createProduct(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
      /* next(error); */
    }
  }
);

router.put("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const { body } = req;
    const result = await productController.updateById(pid, body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    /* next(error); */
  }
});

router.delete("/products/:pid", deleteProductCart, async (req, res, next) => {
  try {
    const { pid } = req.params;
    const result = await productController.deleteById(pid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    /* next(error); */
  }
});

router.get('/mockingproducts', async (req, res, next) =>{
  const product = [];
  for (let index = 0; index < 100; index++) {
    product.push(generateProduct());
  }
  res.status(200).json(product);
});

export default router;
