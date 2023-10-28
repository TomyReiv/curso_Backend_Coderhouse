import { Router } from "express";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import userManager from "../dao/userManager.js";


const router = Router();

router.get("/users", async (req, res) => {
  const { query = {} } = req;
  const user = await userManager.get(query);
  res.status(200).json(user);
});

router.get("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const users = await userManager.getById({ _id: uid });
    if (!users) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      ...userData,
      password: hash,
    });
    const result = await userManager.createUser(newUser);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userManager.findUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: "Nombre de usuario incorrecto" });
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }

    res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});


router.put("/users/uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { body } = req;
    const result = await userManager.updateById(uid, body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await userManager.deleteById(uid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
