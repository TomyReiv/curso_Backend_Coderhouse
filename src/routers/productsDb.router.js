import { Router } from "express";
import { uploader, jwtAuth, jwtAuthBear } from "../utils.js";
import productController from "../controllers/product.controller.js";
import EnumsError from "../utils/EnumsError.js";
import { CustomError } from "../utils/CustomError.js";
import { generatorProductError } from "../utils/CauseMessageError.js";
import { deleteProductCart } from "../middleware/daleteCascade.js";
import {
  productValidator,
  validationErrorProduct,
} from "../middleware/product.validators.js";
import { config } from "../config/config.js";
import userController from "../controllers/user.controller.js";
import emailService from "../services/email.service.js";
import Jwt from "jsonwebtoken";
import cloudinary  from "../config/cloudinary.js"

const router = Router();

router.get(
  "/products",
  /* jwtAuth, */ async (req, res, next) => {
    try {
      const { query = {} } = req;
      const product = await productController.get(query);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
);

router.get("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productController.getById({ _id: pid });
    if (!product) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post(
  "/products/:typeFile",
  uploader.single("file"),
  productValidator,
  validationErrorProduct,
  async (req, res, next) => {
    try {
      if (req.user) {
        const { rol } = req.user;

        if (rol === "user") {
          return res.status(401).json({ message: "Unauthorized" });
        }
      }

      const {
        title,
        description,
        price,
        code,
        stock,
        category,
        owner,
        thumbnail,
      } = req.body;
      if (!title || !description || !price || !code || !stock || !category) {
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

      const image = req.file;
      if (image) {
        const res = await cloudinary.uploader.upload(image.path);
        if (res) {
          const local = `${image.destination}/${image.filename}`;
          req.body.thumbnail =  {
            filename: `${image.destination}/${image.filename}`,
            path: res.secure_url,
          };
          await unlink(local);
        }
      }

/*       if (req.body.file) {
        req.body.thumbnail = {
          filename: req.body.file,
          path: `${config.BASE_URL}/img/${req.body.file}`,
        };
      } */
      //Comentar para pasar los test de product
      if (req.user) {
        req.body.owner = req.user.email || "admin";
      }

      //fin
      const result = await productController.createProduct(req.body);

      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
);

router.put(
  "/products/:pid",
  uploader.single("file"),
  /* jwtAuth, */ async (req, res, next) => {
    try {
      const { pid } = req.params;
      const { body } = req;
      let rolUser;
      //Comentar para pasar los test de product
      if (req.user) {
        const { rol } = req.user;
        rolUser = rol;
      } else {
        const userOwner = await productController.getById(pid);
        const userData = await userController.findUserByEmail(userOwner.owner);
        rolUser = userData.rol;
      }

      if (rolUser === "premium") {
        const { email } = req.user;
        const product = await productController.getById(pid);
        if (product.owner !== email) {
          return res
            .status(403)
            .json({ message: "Solo el dueño puede modificar este preducto" });
        }
      }
      //fin
      const image = req.file;
      if (image) {
        const res = await cloudinary.uploader.upload(image.path);
        if (res) {
          const local = `${image.destination}/${image.filename}`;
          req.body.thumbnail =  {
            filename: `${image.destination}/${image.filename}`,
            path: res.secure_url,
          };
          await unlink(local);
        }
      }
      /* if (req.file) {
        req.body.thumbnail = {
          filename: req.file.filename,
          path: `${config.BASE_URL}/img/${req.file.filename}`,
        };
      }

      if (req.body.file) {
        req.body.thumbnail = {
          filename: req.body.file,
          path: `${config.BASE_URL}/img/${req.body.file}`,
        };
      } */

      const result = await productController.updateById(pid, body);
      res.status(201).json({ message: "Producto modificado correctamente" });
    } catch (error) {
      console.log(error);
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
);

router.delete(
  "/products/:pid",
  /* jwtAuth, */ async (req, res, next) => {
    try {
      const { pid } = req.params;
      //Comentar para pasar los test de product

      let rolUser;
      let emailUser;

      if (req.user) {
        const { rol, email } = req.user;
        rolUser = rol;
        emailUser = email;
      } else {
        const userOwner = await productController.getById(pid);
        const userData = await userController.findUserByEmail(userOwner.owner);
        rolUser = userData.rol;
        emailUser = userData.email;
      }

      const product = await productController.getById(pid);

      if (rolUser === "user") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (rolUser === "premium") {
        if (product.owner != emailUser) {
          return res
            .status(403)
            .json({ message: "Solo el dueño puede borrar este preducto" });
        }
      }

      //fin
      await productController.deleteById(pid);
      await deleteProductCart(pid);

      //Envio de email

      if (userData.rol === "premium") {
        const result = await emailService.sendEmail(
          userData.email,
          userData.username,
          `
                      <!DOCTYPE html>
                      <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Recuperación de Contraseña</title>
                        <style>
                          body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            text-align: center;
                          }
                      
                          .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                          }
                      
                          h1 {
                            color: #333333;
                          }
                      
                          p {
                            color: #666666;
                          }
                      
                          .btn {
                            display: inline-block;
                            padding: 10px 20px;
                            font-size: 16px;
                            text-decoration: none;
                            color: #ffffff;
                            background-color: #007BFF;
                            border-radius: 5px;
                          }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <h1>Producto eliminado</h1>
                          <p>El administrador elimino su producto de la lista de ventas</p>
                        </div>
                      </body>
                      </html>        
                      `
        );
      }
      res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.log(error);
      req.logger.log("error", error);
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
);

router.get("/mockingproducts", jwtAuth, async (req, res, next) => {
  const product = [];
  for (let index = 0; index < 100; index++) {
    product.push(generateProduct());
  }
  res.status(200).json(product);
});

export default router;
