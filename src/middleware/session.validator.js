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


export const authPolicies = (roles) => (req, res, next) => {
  try {
    
    if (!req.user || !req.user.rol) {
      return res.status(401).redirect('/login');
    }

    const { rol } = req.user;

    if (roles.includes("admin") && rol !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para acceder a esta página" });
    }

    if (roles.includes("user") && rol !== "user") {
      return res.status(403).json({ message: "No tienes permiso para acceder a esta página" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
