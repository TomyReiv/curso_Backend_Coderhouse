import { Router } from "express";
import {
  privateRouter,
  publicRouter,
  adminValidator
} from "../middleware/session.validator.js";
import cartManagers from "../dao/cartManagers.js";


const router = Router();

router.get("/realTimeProducts", privateRouter, adminValidator, (req, res) => {
  res.render("index", { title: "Cargas", style: "style.css" });
});

router.get("/login", publicRouter, (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/", privateRouter, (req, res) => {
  const user = req.session.user.username;
  const uid = req.session.user._id.trim();
  res.render("home", { title: "Home", user, uid, style: "home.css" });
});

router.get("/register", publicRouter, (req, res) => {
  res.render("register", { title: "Register", style: "register.css" });
});

router.get("/cart", privateRouter, async (req, res) => {
  res.render("cart", {title: "Carrito", style: "carrito.css"});
});

router.get("/producto/:pid", privateRouter, (req, res) => {
  res.render("producto", { title: "Producto" });
});

router.get("/edit/:pid", privateRouter, (req, res) => {
  res.render("edit", { title: "Editar" });
});

export default router;
