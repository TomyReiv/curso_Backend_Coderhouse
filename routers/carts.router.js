import { Router } from "express";
import cartsManage from "../src/classes/shopCart.js";
import { v4 as uuidv4 } from "uuid";

const cartManage = new cartsManage();

const router = Router();

router.get("/cart/:id", async (req, res) => {
    const { id } = req.params;
    res.send(await cartManage.getCartById(id));
});

router.post('/cart/product/:pid', async (req, res) => {
    try {
      const pid = req.params;
      const id = req.query.id;


      const result = await cartManage.addProductToCart(id ?? uuidv4(), pid);

      res.status(201).json({ message: result });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

export default router;
