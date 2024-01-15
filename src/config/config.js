import dotenv from "dotenv";

 dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 8080,
  DB_HOST: process.env.DB_HOST,
  SERVER_SECRET: process.env.SERVER_SECRET,
  JwtSecret: process.env.JWT_SECRET,
  //coneccion con github
  callback: process.env.callback,
  AppID: process.env.AppID,
  ClientID: process.env.ClientID,
  clientSecret: process.env.clientSecret,
  //coneccion con gmail
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_PASS
};
