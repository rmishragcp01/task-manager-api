const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userOneId,
      testUser,
      setupDatabase,
      testUserTwo,
      userTwoId,
      taskOne,
      taskTwo,
      taskThree} = require('./fixtures/db-setup')

beforeEach(setupDatabase)

test('Should create task for user', async ()=>{
    const response = await request(app)
                           .post('/tasks')
                           .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
                           .send({
                               description:'From a test suite'
                           })
                           .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should get all tasks for user one', async ()=>{
    const response = await request(app)
                           .get('/tasks')
                           .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
                           .send()
                           .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks', async()=>{
    const response = await request(app)
                           .delete(`/tasks/${taskOne._id}`)
                           .set('Authorization', `Bearer ${testUserTwo.tokens[0].token}`)
                           .send()
                           .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})