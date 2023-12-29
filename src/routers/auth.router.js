import { Router } from "express";
import passport from "passport";
import { tokenGenerator } from "../utils.js";

const router = Router();
// Rutas de google
router.get("/auth/google", passport.authenticate('google', { scope: ['profile'] }));

router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res, next) => {
    try {
      // Imprime información útil para depuración
      console.log('req.user', req.user);

      const { _id, username, lastname, email } = req.user;
      const token = tokenGenerator(req.user, '24h');

      // Configura la cookie con el token
      res.cookie("accessToken", token, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        signed: true,
      }).redirect("/");
    } catch (error) {
      // Manejo de errores
      res.status(error.statusCode || 500).json({ message: error.message });
      next(error);
    }
  }
);
  export default router;