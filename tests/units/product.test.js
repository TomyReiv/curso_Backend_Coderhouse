import mongoose from "mongoose";
import Assert from "assert";
import productManager from "../../src/dao/productManager.js";
import { config } from "../../src/config/config.js";

const assert = Assert.strict;

describe('Preubas al modulo productManager', function () {
    this.timeout(5000);
    before(async function(){
        const URL = config.DB_HOST_TEST;
        await mongoose.connect(URL);
        console.log('Conectado a la db correctamente');
    });
    after(async function(){
        await mongoose.connection.close();
    });

    it('Debe crear un producto de forma exitosa', async function(){
        
        const result = await productManager.createProduct({
            title: 'Caja',
            description:  'Una caja para guardar cosas',
            price:  12,
            thumbnail: [],
            code:  'c12',
            stock:   3,
            category:  'Electronica'
        });
        assert.ok(result._id);
        assert.strictEqual(result.owner, 'admin');
    });
    it('Debe obtener la lista de productos de forma exitosa', async function(){
        const result = await productManager.get()
        assert.ok(result.docs[0]._id);
        assert.strictEqual(result.docs[0].owner, 'admin');
    })
    it('Debe modificar un producto de forma exitosa', async function(){
        const product = await productManager.get()
        const data = {$set: {'title': 'Caja grande'}}
        const criterio = { _id: product.docs[0]._id };
        const result = await productManager.updateOne(criterio, data)
        assert.strictEqual(result.message, 'Producto actualizado');
    })
    xit('Debe eliminar un producto de forma exitosa', async function(){
        const product = await productManager.get();
        const criterio = product.docs[0]._id;
        const result = await productManager.deleteById(criterio)
        assert.strictEqual(result.message, 'Producto eliminado');
    })
})