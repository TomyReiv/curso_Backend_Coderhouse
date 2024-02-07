import { expect } from 'chai';
import supertest from "supertest";


const requester = supertest('http://localhost:8080');

describe('Testing products', ()=>{
    describe('test of users', ()=>{
        it('Debe crear un producto correctamente', async function(){
            const product ={
                title: 'Caja',
                description:  'Una caja para guardar cosas',
                price:  12,
                thumbnail: [],
                code:  'c12',
                stock:   3,
                category:  'Electronica',
                owner: 'admin'
            };
            const {
                statusCode,
                ok,
                _body
        } = await requester.post('/api/products').send(product);
        expect(statusCode).to.be.equals(201);
        expect(ok).to.be.ok; 
        expect(Array.isArray(_body.thumbnail)).to.be.true;
        });
        it('Debe traer todos los productos', async function(){
            const {
                statusCode,
                ok,
                _body
            } = await requester.get('/api/products')
            expect(statusCode).to.be.equals(200);
            expect(ok).to.be.ok;
            expect(Array.isArray(_body.payload)).to.be.true;
        })
        it('Debe actualizar un producto correctamente', async function(){
            const product ={
                title: 'Caja',
                description:  'Una caja para guardar cosas',
                price:  12,
                thumbnail: [],
                code:  'c13',
                stock:   3,
                category:  'Electronica',
                owner: 'admin'
            };
            const {
                _body
        } = await requester.post('/api/products').send(product);
            const {
                statusCode,
                ok
        } = await requester.put(`/api/products/${_body._id}`).send({title: 'Moto',});
        expect(statusCode).to.be.equals(201);
        expect(ok).to.be.ok;
        });
        it('Debe eliminar un producto correctamente', async function(){
            const product ={
                title: 'Caja',
                description:  'Una caja para guardar cosas',
                price:  12,
                thumbnail: [],
                code:  'c14',
                stock:   3,
                category:  'Electronica',
                owner: 'admin'
            };
            const {
                _body
        } = await requester.post('/api/products').send(product);
            const {
                statusCode,
                ok
        } = await requester.delete(`/api/products/${_body._id}`)
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        });
    });
});