import { expect } from 'chai';
import supertest from "supertest";


const requester = supertest('http://localhost:8080');

describe('Testing products', ()=>{
    describe('test of users', ()=>{
        it.only("Debe crear un carrito",async function(){
            const cart ={
                userId: '65c3f573b3d86528c769bc44',
                items: [
                    {
                        pid: "65b57e6af97f21387f308ace",
                        quantity: 4
                    }
                ]
            } 
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/cart').send(cart)
            expect(statusCode).to.be.equals(201);
            expect(ok).to.be.ok;
            expect(_body.message).to.be.equals('Producto agregado al carrito')
        } )
        it("Debe traer todos los carritos de compra", async function() {
            const {
                statusCode,
                ok,
                _body
            } = await requester.get('/api/cart')
            expect(statusCode).to.be.equals(200);
            expect(ok).to.be.ok;
        })
    })
})


