import { Router } from "express";

const router = Router();

router.get("/realTimeProducts", (req, res) => {
  res.render("index", { title: "Cargas", style: "style.css" });
});

router.get("/login", (req, res) => {
  res.render("login", {title: "Login"});
});

router.get("/", (req, res) => {
  res.render("home", {title: "Home", style: "home.css" });
});

router.get("/register", (req, res) => {
  res.render("register", {title: "Register", style: "register.css" });
});

router.get("/cart", (req, res) => {
  res.render("cart", {title: "Carrito", style: "carrito.css" });
});

router.get("/producto/:pid", (req, res) => {
    res.render("producto", {title: "Producto"});
});

router.get("/edit/:pid", (req, res) => {
  res.render("edit", {title: "Editar"});
});
export default router;
