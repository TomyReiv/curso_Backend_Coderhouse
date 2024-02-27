import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import ticketController from "../controllers/ticket.controller.js";
/* import userController from "../controllers/user.controller.js";
import productController from "../controllers/product.controller.js"; */
import { config } from "../config/config.js";
import Jwt from "jsonwebtoken";
import emailService from "../services/email.service.js";

const router = Router();

router.get("/cart", async (req, res, next) => {
  try {
    const { query = {} } = req;
    const cart = await cartController.get(query);
    res.status(200).json(cart);
  } catch (error) {
    req.logger.log("error", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.get("/cartUser", async (req, res, next) => {
  try {
    const token = req.signedCookies["accessToken"];

    Jwt.verify(token, config.JwtSecret, async (error, payload) => {
      if (error) res.status(403).json({ message: "No authorized" });
      req.user = payload;
    });
    const userId = req.user.id;
    const cart = await cartController.get({ userId });
    res.status(200).json(cart);
  } catch (error) {
    req.logger.log("error", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.get("/cart/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartController.getById({ _id: cid });
    if (!cart) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    req.logger.log("error", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/cart", async (req, res, next) => {
  try {
    const { body } = req;
    const result = await cartController.create(body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    req.logger.log("error", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.put("/cart/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { body } = req;
    const result = await cartController.updateById(cid, body);
    res.status(201).json(result);
  } catch (error) {
    req.logger.log("error", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.put("/carts/:cid/products/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { body } = req;

    const cart = await cartController.getById(cid);

    const productFind = cart.items.find((item) => {
      const id = item.pid._id.toString();
      return id === pid;
    });

    if (!productFind) {
      return res
        .status(404)
        .json({ message: "El producto no está en el carrito" });
    }

    await cartController.findOneAndUpdate(
      { _id: cid, "items.pid": pid },
      { $set: { "items.$.quantity": body.quantity } }
    );

    return res
      .status(200)
      .json({ message: "Cantidad del producto actualizada en el carrito" });
  } catch (error) {
    req.logger.log("error", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/cart/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const result = await cartController.deleteById(cid);
    res.status(200).json(result);
  } catch (error) {
    req.logger.log("error", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/cart/:cid/product/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartController.getById(cid);

    const productIndex = cart.items.findIndex((item) => {
      const id = item.pid._id.toString();
      return id === pid;
    });

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "El producto no está en el carrito" });
    }

    cart.items.splice(productIndex, 1);
    await cart.save();

    return res.status(200).json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    req.logger.log("error", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/cart/:cid/purchase", async (req, res, next) => {
  try {
    const { body } = req;
    const { cid } = req.params;
    const { email, username } = req.user;

    const ticket = await ticketController.create(cid, body);
    //Email  de compra exitosa

    const result = await emailService.sendEmail(
      email,
      username,
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Compra</title>
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
      
          .ticket-info {
            margin-top: 20px;
            border-collapse: collapse;
            width: 100%;
          }
      
          .ticket-info td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
          }
      
          .ticket-info th {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
            background-color: #f2f2f2;
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
          <h1>Compra realizada correctamente</h1>
          <p>Aquí está su ticket de compra:</p>
          <table class="ticket-info">
            <tr>
              <th>Detalle</th>
              <th>Valor</th>
            </tr>
            <tr>
              <td>Código de Compra</td>
              <td>${ticket.code}</td>
            </tr>
            <tr>
              <td>Fecha y Hora de Compra</td>
              <td>${ticket.purchase_datetime}</td>
            </tr>
            <tr>
              <td>Monto</td>
              <td>${ ticket.amount }</td>
            </tr>
            <tr>
              <td>Comprador</td>
              <td>${ticket.purchaser}</td>
            </tr>
          </table>
          <p>¡Gracias por su compra!</p>
        </div>
      </body>
      </html>`
    );

    res.status(201).json({ message: "Compra realizada" });
  } catch (error) {
    req.logger.log("error", error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
