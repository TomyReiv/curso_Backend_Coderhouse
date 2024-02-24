import cron from "node-cron";
import userController from "../controllers/user.controller.js";
import cartController from "../controllers/cart.controller.js";
import emailService from "../services/email.service.js";
import { config } from "../config/config.js";

export class UserInactiveProcess {
  constructor() {}

  run() {
    cron.schedule(
      "*/5 * * * *", // Ejecutar cada 5 minutos
      async () => {
        try {
          console.log("Corriendo el cron");
          const URL = config.URL || "http://localhost:8080";
          const users = await userController.get();

          //Prueba para 5 minutos
          /* const fiveMinutesAgo = new Date();
          fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

          const inactiveUsers = users.filter((user) => {
            const lastConnection = new Date(user.last_connection);
            return lastConnection <= fiveMinutesAgo;
          }); */ 

          //Prueba para 2 dias
          const twoDaysAgo = new Date();
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

          const inactiveUsers = users.filter((user) => {
            const lastConnection = new Date(user.last_connection);
            const differenceInMillis = twoDaysAgo - lastConnection;
            const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);
            return differenceInDays >= 2;
          }); 

          inactiveUsers.forEach(async (user) => {
            await userController.deleteById(user.id);
            await cartController.deleteOne({ userId: user.id });
            const result = await emailService.sendEmail(
              user.email,
              user.username,
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
                                <h1>Su cuenta fue eliminada por inactividad</h1>
                                <p>Haz clic en el siguiente enlace para re activar su cuenta:</p>
                                <a class="btn" href="${URL}/register">Activar cuenta</a>
                              </div>
                            </body>
                            </html>        
                            `
            );
          });

          console.log(
            "Proceso de eliminación de usuarios inactivos completado"
          );
        } catch (error) {
          console.error("Error en el proceso de usuarios inactivos:", error);
        }
      },
      {
        scheduled: true,
        timezone: "America/Argentina/Buenos_Aires",
        immediate: true, // Ejecutar la tarea inmediatamente al iniciar
      }
    );
  }
}
