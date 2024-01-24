import mongoose from "mongoose";
import {config} from "../config/config.js"

export const init = async () =>{
    try {
        const URL = config.DB_HOST 
        await mongoose.connect(URL);
        console.log('Conectado a la db correctamente');
    } catch (error) {
        console.error(error);
    }
}