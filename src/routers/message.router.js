import { Router } from "express";
import messageManager from "../dao/messageManager.js";

const router = Router();

router.get("/message", async (req, res) => {
  const { query = {} } = req;
  const product = await messageManager.get(query);
  res.status(200).json(product);
});

router.get("/message/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const message = await messageManager.getById({ _id: cid });
    if (!message) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/message", async (req, res) => {
  try {
    const { body } = req;
    const result = await messageManager.create(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.put("/message/cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { body } = req;
    const result = await messageManager.updateById(cid, body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/message/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await messageManager.deleteById(cid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
