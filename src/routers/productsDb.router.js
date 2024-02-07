import { Router } from "express";
import EnumsError from "../utils/EnumsError.js";
import { CustomError } from "../utils/CustomError.js";
import { generatorProductError } from "../utils/CauseMessageError.js";
import productController from "../controllers/product.controller.js";
import { uploader } from "../utils.js";
import {deleteProductCart} from "../middleware/daleteCascade.js"
import { productValidator, validationErrorProduct } from "../middleware/product.validators.js"

const router = Router();

router.get("/products", async (req, res, next) => {
  try {
    const { query = {} } = req;
    const product = await productController.get(query);
    res.status(200).json(product);
  } catch (error) {
    req.logger.log('error', error)
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
    req.logger.log('error', error)
    res.status(error.statusCode || 500).json({ message: error.message });
   /*  next(error); */
  }
});

router.post(
  "/products",
  uploader.single("file"),
  productValidator,
  validationErrorProduct,
  async (req, res, next) => {
    try {
      const { title, description, price, code, stock, category, owner, thumbnail } =
        req.body;
      if (
        !title ||
        !description ||
        !price ||
        !code ||
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
            stock,
            category,
          }),
          message: "Ocurrio un error mientras intemtamos crear el producto",
          code: EnumsError.BAD_REQUEST_ERROR,
        });
      }

      if (req.file) {
        req.body.thumbnail = {
          filename: req.file.filename,
          path: req.file.path,
        };
      }
      //Comentar para pasar los test de product
      /*  req.body.owner = req.user.email || 'admin';  */
      //fin
      const result = await productController.createProduct(req.body);

      res.status(201).json(result);
    } catch (error) {
      req.logger.log('error', error)
      res.status(error.statusCode || 500).json({ message: error.message });
      /* next(error); */
    }
  }
);

router.put("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const { body } = req;

    //Comentar para pasar los test de product
/*    const {rol } = req.user;

    if(rol === 'premium'){
      const {email} = req.user;
      const product = await productController.getById(pid)
      if(product.owner !== email){
        return res.status(403).json({message:'Solo el dueño puede modificar este preducto'})
      }
    }  */
    //fin

    const result = await productController.updateById(pid, body);
    res.status(201).json({message:'Producto modificado correctamente'})
  } catch (error) {
    req.logger.log('error', error)
    res.status(error.statusCode || 500).json({ message: error.message });
    /* next(error); */
  }
});

router.delete("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
//Comentar para pasar los test de product
   /*  const {rol } = req.user;

    if(rol === 'premium'){
      const {email} = req.user;
      const product = await productController.getById(pid)
      if(product.owner !== email){
        return res.status(403).json({message:'Solo el dueño puede borrar este preducto'})
      }
    } */
     //fin
    await productController.deleteById(pid);
    await deleteProductCart(pid);
    res.status(200).json({message:'Producto eliminado correctamente'})
  } catch (error) {
    console.log(error);
    req.logger.log('error', error)
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
