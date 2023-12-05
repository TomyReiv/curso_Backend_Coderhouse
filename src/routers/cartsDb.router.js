import { Router } from "express";
import cartManager from "../dao/cartManagers.js";
import cartModel from "../models/cart.model.js";
import { config } from "../config.js";
import Jwt from 'jsonwebtoken';


const router = Router();

router.get("/cart", async (req, res) => {
  const { query = {} } = req;

  const cart = await cartManager.get(query);
  res.status(200).json(cart);
});

router.get("/cartUser", async (req, res) => {
  /* const userId = req.session.user._id; */
  const token = req.signedCookies['accessToken']

  Jwt.verify(token, config.JwtSecret, async (error, payload)=>{
    if(error) res.status(403).json({message:'No authorized'});
    req.user = payload
})
  const userId = req.user.id.trim();
  const cart = await cartManager.get({userId});
  res.status(200).json(cart);
});

router.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getById({ _id: cid });
    if (!cart) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { body } = req;
    const result = await cartManager.create(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.put("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { body } = req;
    const result = await cartManager.updateById(cid, body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.put("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { body } = req;
    const cart = await cartManager.getById(cid);

    if (!cart) {
      return res.status(404).json({ message: "El carrito no existe" });
    }

    const productFind = cart.items.find((item) => {
      const id = item.pid._id.toString();
      return id === pid;
    });

    if (!productFind) {
      return res
        .status(404)
        .json({ message: "El producto no está en el carrito" });
    }

    await cartModel.findOneAndUpdate(
      { _id: cid, "items.pid": pid },
      { $set: { "items.$.quantity": body.quantity } }
    );

    return res
      .status(200)
      .json({ message: "Cantidad del producto actualizada en el carrito" });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la cantidad del producto en el carrito",
    });
  }
});

router.delete("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartManager.deleteById(cid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/cart/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartManager.getById(cid);

    if (!cart) {
      return res.status(404).json({ message: "El carrito no existe" });
    }

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
    return res
      .status(500)
      .json({ message: "Error al eliminar el producto del carrito" });
  }
});

export default router;
