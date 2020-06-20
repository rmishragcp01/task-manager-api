const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


const userOneId = new mongoose.Types.ObjectId()
const testUser = {
    _id: userOneId,
    name: 'Test User',
    email: 'test@example.com',
    password: 'MyPass777',
    tokens: [
        {
            token: jwt.sign({_id: userOneId},process.env.TOKEN_SIGNING_STRING)
        }
    ]
}

const userTwoId = new mongoose.Types.ObjectId()
const testUserTwo = {
    _id: userTwoId,
    name: 'Test User Two',
    email: 'testuser2@example.com',
    password: 'MyPass777',
    tokens: [
        {
            token: jwt.sign({_id: userTwoId},process.env.TOKEN_SIGNING_STRING)
        }
    ]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'this is a test task one',
    completed: true,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'this is a test task two',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'this is a test task three',
    completed: true,
    owner: userTwoId
}

const setupDatabase = async ()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(testUser).save()
    await new User(testUserTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    testUser,
    setupDatabase,
    userTwoId,
    testUserTwo,
    taskOne,
    taskTwo,
    taskThree
}