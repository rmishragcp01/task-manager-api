const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,testUser,setupDatabase} = require('./fixtures/db-setup')


beforeEach(setupDatabase)

test('Should signn up the user', async()=>{
    const response = await request(app).post('/users').send({
        name: 'Rohit Mishra',
        email: 'rmishra@test.com',
        password: 'MyPass777'
    }).expect(201)
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user:{
            name: 'Rohit Mishra',
            email: 'rmishra@test.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass777')
})

test('Should login existing user', async()=>{
    const response = await request(app).post('/users/login').send({
        email: testUser.email,
        password: testUser.password
    }).expect(200)
    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user', async()=>{
    await request(app).post('/users/login').send({
       email: 'baduser@example.com',
       password: 'badpassword'
    }).expect(400)

})

test('Should get profile of a signed-in user', async ()=>{
    await request(app)
         .get('/users/me')
         .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
         .send()
         .expect(200)
})

test('Should not get profile when not signed-in', async ()=>{
    await request(app)
         .get('/users/me')
         .send()
         .expect(401)
})

test('Should delete profile of a signed-in user', async()=>{
    await request(app)
          .delete('/users/me')
          .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
          .send()
          .expect(200)
    const user = await User.findById(testUser._id)
    expect(user).toBeNull()
})

test('Should not delete profile when not signed-in', async()=>{
    await request(app)
          .delete('/users/me')
          .send()
          .expect(401)
})

test('Should upload avatar image', async ()=>{
    await request(app)
          .post('/users/me/avatar')
          .set('Authorization',`Bearer ${testUser.tokens[0].token}`)
          .attach('avatar','tests/fixtures/profile-pic.png')
          .expect(200)
    const user = await User.findById(testUser._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async()=>{
    await request(app)
          .patch('/users/me')
          .set('Authorization',`Bearer ${testUser.tokens[0].token}`)
          .send({
              name: 'Jesse'
          })
          .expect(200)
    const user = await User.findById(testUser._id)
    expect(user.name).toEqual('Jesse')
})

test('Should not update invalid fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${testUser.tokens[0].token}`)
    .send({
        location: 'Illinois'
    })
    .expect(400)
})
