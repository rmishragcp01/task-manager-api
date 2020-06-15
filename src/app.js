/*Standard express.js work required*/
require('./db/mongoose')
const express = require('express')
/*Instantiate express*/
const app = express()
const userRouter = require('./routers/userrouter')
const taskRouter = require('./routers/taskrouter')
/*The app.use(express.json()) being a standard middleware function exported by express, will parse the json from request body
this function recognizes the POST request body as a JSON object and make it available for direct use where
a JSON object is needed such as while instatiating the mongoose User model before saving to the database.
*/
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
/*Export the configured express application for use in index.js and test suite as well*/
module.exports = app