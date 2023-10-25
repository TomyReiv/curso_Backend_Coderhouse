import mongoose from "mongoose";


export const init = async () =>{
    try {
        const URL = "mongodb+srv://tomyreiv:SFoIjrB7OwvVrj5Q@cluster0.uxwlajt.mongodb.net/usersBackend";
        await mongoose.connect(URL);
        console.log('Conectado a la db correctamente');
    } catch (error) {
        console.error(error);
    }
}