import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const init = async () =>{
    try {
        const URL = process.env.DB_HOST 
        await mongoose.connect(URL);
        console.log('Conectado a la db correctamente');
    } catch (error) {
        console.error(error);
    }
}