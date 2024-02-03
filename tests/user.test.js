import mongoose from "mongoose";
import Assert from "assert";
import userManager from "../src/dao/userManager.js";
import { config } from "../src/config/config.js";

const assert = Assert.strict;

describe('Preubas al modulo userManager', function () {
    this.timeout(5000);
    before(async function(){
        const URL = config.DB_HOST_TEST;
        await mongoose.connect(URL);
        console.log('Conectado a la db correctamente');
    });
    after(async function(){
        await mongoose.connection.collections.users.drop();
        await mongoose.connection.close();
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
        assert.strictEqual(result.message, 'Usuario creado');
    });
    it('Debe obtener la lista de usuarios de forma exitosa', async function(){
        const result = await userManager.get()
        assert.ok(result[0]._id);
        assert.strictEqual(result[0].rol, 'user');
    })
    it('Debe modificar un usuario de forma exitosa', async function(){
        const user = await userManager.get()
        const data = {$set: {'lastname': 'Martin'}}
        const criterio = { _id: user[0]._id };
        const result = await userManager.updateById(criterio, data)
        assert.strictEqual(result.message, 'Usuario actualizado');
    })
    it('Debe eliminar un usuario de forma exitosa', async function(){
        const user = await userManager.get();
        const criterio = { _id: user[0]._id };
        const result = await userManager.deleteOne(criterio)
        assert.strictEqual(result.message, 'Usuario eliminado');
    })
})