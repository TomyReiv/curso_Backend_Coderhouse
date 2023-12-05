import { Router } from "express";
import {
  privateRouter,
  publicRouter,
  adminValidator,
  authPolicies
} from "../middleware/session.validator.js";
import cartManagers from "../dao/cartManagers.js";
import passport from "passport";
import { config } from "../config.js";
import Jwt from 'jsonwebtoken';
import userModel from "../models/user.model.js";


const router = Router();

router.get("/realTimeProducts", authPolicies(['admin']), passport.authenticate('jwt', {session:false}),  (req, res) => {
  res.render("index", { title: "Cargas", style: "style.css" });
});

router.get("/login", publicRouter, (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/", authPolicies(['user', 'admin']), passport.authenticate('jwt', {session:false}),  (req, res) => {
 
  const token = req.signedCookies['accessToken']

  Jwt.verify(token, config.JwtSecret, async (error, payload)=>{
    if(error) res.status(403).json({message:'No authorized'});
    req.user = payload
})
  const user = req.user.username;
  const uid = req.user.id;
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
