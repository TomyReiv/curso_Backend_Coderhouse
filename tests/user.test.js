import mongoose from "mongoose";
import Assert from "assert";
import userManager from "../src/dao/userManager.js";
import { config } from "../src/config/config.js";

const assert = Assert.strict;

describe('Preubas al modulo userManager', function () {
    this.timeout(5000);
    before(async function(){
        const URL = config.DB_HOST 
        await mongoose.connect(URL);
        console.log('Conectado a la db correctamente');
    });
    after(async function(){
        await mongoose.connection.close()
    });

    it('Debe crear un usuario de forma exitosa', async function(){
        
        const result = await userManager.createUser({
            username: 'Juan',
            lastname: 'Perez',
            password: '123456',
            email: 'juanperez@test.com',
            address: {
                street: 'False',
                city: 'Falso',
                country: 'Mexico'
            }
        });
        console.log(result);
        
    })
})