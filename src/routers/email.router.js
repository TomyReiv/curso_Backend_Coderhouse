import { Router } from "express";
import { tokenGenerator } from "../utils.js";
import emailService from "../services/email.service.js";
import userController from "../controllers/user.controller.js";
import Jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const router = Router();

router.post("/pass-recover", async (req, res, next) => {
  try {
    const { email, username } = req.body;

    const user = await userController.findUserByEmail(email);
    if (!user) res.status(401).json({ message: "No existe el usuario" });
    const token = tokenGenerator(user, "1h");
    const result = await emailService.sendEmail(
      email,
      username,
      `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de Contraseña</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                text-align: center;
              }
          
              .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
          
              h1 {
                color: #333333;
              }
          
              p {
                color: #666666;
              }
          
              .btn {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                text-decoration: none;
                color: #ffffff;
                background-color: #007BFF;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Recuperación de Contraseña</h1>
              <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
              <a class="btn" href="http://localhost:8080/pass-recover/${token}">Restablecer Contraseña</a>
              <p>Este enlace expirará en 1 hora.</p>
            </div>
          </body>
          </html>        
          `
    );

    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error);
  }
});

router.get("/pass-recover/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    Jwt.verify(token, config.JwtSecret, async (error, payload) => {
      if (error) res.status(403).json({ message: "No authorized" });
      req.user = await userController.findUserByEmail(payload.email);
      res.redirect(`/newPass/${req.user.id}`);
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error);
  }
});

//Email de activacion

router.post("/activacion", async (req, res, next) => {
  try {
    const { email, username } = req.body;

    const user = await userController.findUserByEmail(email);
    const result = await emailService.sendEmail(
      email,
      username,
      `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de Contraseña</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                text-align: center;
              }
          
              .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
          
              h1 {
                color: #333333;
              }
          
              p {
                color: #666666;
              }
          
              .btn {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                text-decoration: none;
                color: #ffffff;
                background-color: #007BFF;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Activacion de cuenta</h1>
              <p>Haz clic en el siguiente enlace para activar su cuenta:</p>
              <a class="btn" href="http://localhost:8080/activacion/${user.id}">Activar cuenta</a>
            </div>
          </body>
          </html>        
          `
    );
    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error);
  }
});

router.get("/activacion/:uid", async (req, res, next) => {
  try {
    const {uid} = req.params;
    console.log('uid params', uid);
    const data = { status: "active" };
    const activated = await userController.updateById(uid, data);
    res.status(200).redirect('/');
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error);
  }
});

export default router;
