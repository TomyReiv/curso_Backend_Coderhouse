import mongoose from "mongoose";
/* import dotenv from "dotenv"; */
import {config} from "../config.js"

/* dotenv.config(); */


export const init = async () =>{
    try {
        const URL = config.DB_HOST 
        await mongoose.connect(URL);
        console.log('Conectado a la db correctamente');
    } catch (error) {
        console.error(error);
    }
}