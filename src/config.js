import dotenv from "dotenv";

/* dotenv.config(); */

export const config = {
  DB_HOST: process.env.DB_HOST,
  SERVER_SECRET: process.env.SERVER_SECRET,
  JwtSecret: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  //coneccion con github
  callback: process.env.callback,
  AppID: process.env.AppID,
  ClientID: process.env.ClientID,
  clientSecret: process.env.clientSecret,
};
