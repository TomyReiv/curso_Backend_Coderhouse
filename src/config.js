import dotenv from "dotenv";

 dotenv.config();

export const config = {
  PORT: process.env.PORT || 8080,
  DB_HOST: process.env.DB_HOST,
  SERVER_SECRET: process.env.SERVER_SECRET,
  JwtSecret: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  //coneccion con github
  callback: process.env.callback,
  AppID: process.env.AppID,
  ClientID: process.env.ClientID,
  clientSecret: process.env.clientSecret,
  //coneccion con google
  callback_google: process.env.callback_google,
  API_CLIENTE_GOOGLE: process.env.API_CLIENTE_GOOGLE,
  google_secret: process.env.google_secret
};
