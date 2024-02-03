import mongoose from "mongoose";
import Assert from "assert";
import cartManager from "../src/dao/cartManagers.js";
import { config } from "../src/config/config.js";

const assert = Assert.strict;

describe('Preubas al modulo cartManager', function () {
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

    it('Debe crear un carrito de forma exitosa', async function(){
        
        const result = await cartManager.create({
            userId: '6596f01a44ad375e0488075c',
            items: [
                {
                    pid: '65be970a5cf4bd86ccc28096',
                    quantity: 2,
                }
            ]
        });
        console.log(result);
        assert.ok(result._id);
    });
    it('Debe obtener la lista de carritos de forma exitosa', async function(){
        const result = await cartManager.get()
        assert.ok(result[0]._id);
    })
    it('Debe modificar un carrito de forma exitosa', async function(){
        const cart = await cartManager.get()
        const data = {$set: {'userId': '65b6e351494d64c6625aee10'}}
        const criterio = { _id: cart[0]._id };
        const result = await cartManager.updateById(criterio, data)
        assert.strictEqual(result.message, 'Carrito actualizado');
    })
    it('Debe eliminar un carrito de forma exitosa', async function(){
        const cart = await cartManager.get();
        const criterio = cart[0]._id;
        const result = await cartManager.deleteOne(criterio)
        assert.strictEqual(result.message, 'Carrito eliminado');
    })
})