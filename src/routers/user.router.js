import { Router } from "express";
import UserModel from "../models/user.model.js";


const router = Router();

router.get("/users", async (req, res) => {
    const users = await UserModel.find();
    if(!users){
        return res.status(404).json({message: 'No user found'});
    }
    res.status(200).json(users);
});

router.get("/users/:uid", async (req, res) => {
    const {uid} = req.params;
    const users = await UserModel.findOne({_id: uid});
    if(!users){
        return res.status(404).json({message: 'No user found'});
    }
    res.status(200).json(users);
});

router.post("/users", async (req, res) => {
    const {body} = req;
    const result = await UserModel.create(body);
    res.status(201).json(result);
});

router.put("/users/uid", async (req, res) => {
    const {uid} = req.params;
    const {body} = req;
    const result = await UserModel.updateOne({_id:uid},{$set:body});
    res.status(201).json(result);
});

router.delete("/users/:uid", async (req, res) => {
    const {uid} = req.params;
    const result = await UserModel.deleteOne({_id: uid});
    res.status(200).json(result);
});


export default router;