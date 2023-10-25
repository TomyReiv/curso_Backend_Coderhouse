import { Router } from "express";
import productModel from "../models/product.model.js";


const router = Router();

router.get("/products", async (req, res) => {
    const products = await productModel.find();
    if(!products){
        return res.status(404).json({message: 'No user found'});
    }
    res.status(200).json(products);
});

router.get("/products/:uid", async (req, res) => {
    const {uid} = req.params;
    const products = await productModel.findOne({_id: uid});
    if(!products){
        return res.status(404).json({message: 'No user found'});
    }
    res.status(200).json(products);
});

router.post("/products", async (req, res) => {
    const {body} = req;
    const result = await productModel.create(body);
    res.status(201).json(result);
});

router.put("/products/uid", async (req, res) => {
    const {uid} = req.params;
    const {body} = req;
    const result = await productModel.updateOne({_id:uid},{$set:body});
    res.status(201).json(result);
});

router.delete("/products/:uid", async (req, res) => {
    const {uid} = req.params;
    const result = await productModel.deleteOne({_id: uid});
    res.status(200).json(result);
});


export default router;