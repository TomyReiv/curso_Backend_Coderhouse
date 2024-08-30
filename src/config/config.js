import dotenv from "dotenv";

 dotenv.config();

export const config = {
  URL:"http://localhost:8080",
  URLFRONT:"http://localhost:4200",
  NODE_ENV: process.env.NODE_ENV,
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT || 8080,
  DB_HOST: process.env.DB_HOST,
  DB_HOST_TEST: process.env.DB_HOST_TEST,
  SERVER_SECRET: process.env.SERVER_SECRET,
  JwtSecret: process.env.JWT_SECRET,
  JwtSecret_PASS: process.env.JWT_SECRET_PASS,
  //coneccion con github
  callback: process.env.callback,
  AppID: process.env.AppID,
  ClientID: process.env.ClientID,
  clientSecret: process.env.clientSecret,
  //coneccion con gmail
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_PASS,
  //cloudinary
  CLOUD_API_KEY: process.env.cloud_api_key,
  CLOUD_API_SECRET: process.env.cloud_secret,
  CLOUD_NAME: process.env.cloud_name
};
