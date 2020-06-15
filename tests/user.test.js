const request = require('supertest')
const app = require('../src/app')

test('Should signn up the user', async()=>{
    await request(app).post('/users').send({
        name: 'Rohit Mishra',
        email: 'rmishra@test.com',
        password: 'MyPass777'
    }).expect(201)
})