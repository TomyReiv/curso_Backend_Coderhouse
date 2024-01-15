import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import ticketController from "../controllers/ticket.controller.js";
import userController from "../controllers/user.controller.js";
import productController from "../controllers/product.controller.js";
import { config } from "../config/config.js";
import Jwt from "jsonwebtoken";

const router = Router();

router.get("/cart", async (req, res, next) => {
  try {
    const { query = {} } = req;

    const cart = await cartController.get(query);
    res.status(200).json(cart);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error);
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
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error);
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
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
  }
});

router.post("/cart", async (req, res, next) => {
  try {
    const { body } = req;
    const result = await cartController.create(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
  }
});

router.put("/cart/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { body } = req;
    const result = await cartController.updateById(cid, body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
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
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
  }
});

router.delete("/cart/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const result = await cartController.deleteById(cid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
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
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
  }
});

router.post("/cart/:cid/purchase", async (req, res, next) =>{
  try {
    const { body } = req;
    const { cid } = req.params;

    const result = await ticketController.create(cid, body);
    /* console.log('Rsult',result); */
    req.logger.log('Rsult cartPost: ', result)
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
  }
})

export default router;
