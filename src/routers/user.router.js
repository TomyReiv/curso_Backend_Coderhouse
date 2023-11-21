import { Router } from "express";
import userManager from "../dao/userManager.js";
import {
  userValidator,
  handleValidationErrors,
} from "../middleware/users.validators.js";
import { isValidPassword } from "../utils.js";
import passport from "passport";
import mongoose from "mongoose";

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

/* router.post("/users",  userValidator, handleValidationErrors, async (req, res) => {
  try {
    const {password, ...body } = req.body;

    const newUser = new UserModel({
      ...body,
      password: createHash(password),
    });
    const result = await userManager.createUser(newUser);

    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}); */

router.post(
  "/users",
  userValidator,
  handleValidationErrors,
  passport.authenticate("register", { failureMessage: "User already register" }),
  async (req, res) => {
    res.status(200).json({message: 'Usuario creado'});
  }
);

router.post(
  "/users/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    const email = req.user.email;
    const { _id, username, lastname} = req.user;
    /* const id = req.user._id.toString().trim(); */
    if (email === "ravetomas@gmail.com") {
      req.session.user = { _id, username, lastname, email, isAdmin: true };
    } else {
      req.session.user = { _id, username, lastname, email, isAdmin: false };
    }
    const user = req.user;
    res.status(200).json(user);
  }
);

router.get("/users/github", passport.authenticate('github', {scope: ['user:email']}));

router.get("/users/github/cb", passport.authenticate('github', { failureRedirect: "/login" }), (req, res)=>{
  const { _id, username, lastname, email } = req.user;
/*   const id = req.user._id.toString().trim(); */
  req.session.user = { _id, username, lastname, email, isAdmin: false };
  res.redirect('/');
});

/* router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const user = await userManager.findUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: "Correo o contraseña invalidos" });
      return;
    }

    const passwordMatch = isValidPassword(password, user);
    console.log(passwordMatch);
    if (!passwordMatch) {
      res.status(401).json({ message: "Correo o contraseña invalidos" });
      return;
    }
    const { _id, username, lastname} = user;
    if(email === 'ravetomas@gmail.com') {
      req.session.user = {_id, username, lastname, email, isAdmin: true};
    }else{
      req.session.user = {_id, username, lastname, email, isAdmin: false};
    }
    res.status(200).json(user);

  } catch (error) {

    res.status(error.statusCode || 500).json({ message: error.message });
  }
}); */

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
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/login");
  });
});
export default router;
