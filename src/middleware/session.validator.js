import Jwt from "jsonwebtoken";
import { config } from "../config.js";

export const privateRouter = (req, res, next) => {
  if (!req.signedCookies["accessToken"]) {
    return res.redirect("/login");
  }
  next();
};

export const publicRouter = (req, res, next) => {
  if (req.signedCookies["accessToken"]) {
    return res.redirect("/");
  }
  next();
};

export const adminValidator = (req, res, next) => {

  const token = req.signedCookies["accessToken"];

  Jwt.verify(token, config.JwtSecret, async (error, payload) => {
    if (error) res.status(403).json({ message: "No authorized" });
    req.user = payload;
  });
  if(req.user.rol === 'user'){
    return res.redirect("/");
  }
  next();
};

export const authPolicies = (roles) => (req, res, next) => {
  try {
    
    if (roles.includes("admin")) {
      return next();
    }
    if (roles.includes("user")) {
      return next();
    }

    const { rol } = req.user;
    if (!roles.includes(rol)) {
      return res
        .status(403)
        .redirect("/login")
        .json({ message: "No tienes permiso" })  
    }
 
    next();
  } catch (error) {
    next(error);
  }
  
};
