import { expect } from 'chai';
import supertest from "supertest";


const requester = supertest('http://localhost:8080');

describe('Testing user', ()=>{
    describe('test of users', ()=>{
        it('Debe crear un usuario correctamente', async function(){
            const user ={
                username: 'Juan',
                lastname: 'Perez',
                password: '123456_',
                email: 'test@test.com',
                address:{
                    street: 'Luro',
                    city: 'Bogota',
                    country: 'Colombia'
                }
            };
            const {
                statusCode,
                ok,
                _body
        } = await requester.post('/api/users').send(user);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(_body.message).to.be.equals('Usuario creado')
        });

        it('Debe hacer login correctamente', async function(){
            const user = {
                username: 'Juan',
                password: '123456_',
                email: 'test@test.com'
            };
            const {
                statusCode,
                ok,
                _body
        } = await requester.post('/api/users/login').send(user);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(_body).to.be.has.property('id')
        })
        it('Debe traer todos los usuarios', async function(){
            const {
                statusCode,
                ok,
                _body
            } = await requester.get('/api/users')
            expect(statusCode).to.be.equals(200);
            expect(ok).to.be.ok;
            expect(Array.isArray(_body)).to.be.true;
        })
        it('Debe actualizar un usuario correctamente', async function(){
            const user ={
                username: 'Juan',
                password: '123456_',
                email: 'test@test.com'
            };
            const {_body} = await requester.post('/api/users/login').send(user);
            const {
                statusCode,
                ok
        } = await requester.put(`/api/users/${_body.id}`).send({lastname:'Gugua'});
        expect(statusCode).to.be.equals(201);
        expect(ok).to.be.ok;
        });
        it('Debe eliminar un usuario correctamente', async function(){
            const user ={
                username: 'Juan',
                password: '123456_',
                email: 'test@test.com'
            };
            const {_body} = await requester.post('/api/users/login').send(user);
            const {
                statusCode,
                ok
        } = await requester.delete(`/api/users/${_body.id}`);
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        });
    });
});